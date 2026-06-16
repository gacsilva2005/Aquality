package com.hydrasense.schydrasense.service;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.hydrasense.schydrasense.dto.DashboardProfissionalDTO;
import com.hydrasense.schydrasense.dto.DashboardProfissionalDTO.*;
import com.hydrasense.schydrasense.dto.WeatherResponseDTO;
import com.hydrasense.schydrasense.model.Atleta;
import com.hydrasense.schydrasense.model.SessaoDeTreino;
import com.hydrasense.schydrasense.repository.AtletaRepository;
import com.hydrasense.schydrasense.repository.EquipeRepository;
import com.hydrasense.schydrasense.repository.SessaoDeTreinoRepository;
import com.hydrasense.schydrasense.model.Equipe;
import org.springframework.stereotype.Service;

import java.time.DayOfWeek;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.*;
import java.util.stream.Collectors;

@Service
public class DashboardProfissionalService {

    private final AtletaRepository atletaRepository;
    private final EquipeRepository equipeRepository;
    private final SessaoDeTreinoRepository sessaoRepository;
    private final CalculadoraFisiologica calculadora;
    private final WeatherService weatherService;
    private final ObjectMapper objectMapper;

    public DashboardProfissionalService(
            AtletaRepository atletaRepository,
            EquipeRepository equipeRepository,
            SessaoDeTreinoRepository sessaoRepository,
            CalculadoraFisiologica calculadora,
            WeatherService weatherService) {
        this.atletaRepository = atletaRepository;
        this.equipeRepository = equipeRepository;
        this.sessaoRepository = sessaoRepository;
        this.calculadora = calculadora;
        this.weatherService = weatherService;
        this.objectMapper = new ObjectMapper();
    }

    public DashboardProfissionalDTO gerarDashboard(Long clubeId, Long equipeId, Integer dias, Double lat, Double lon) {
        DashboardProfissionalDTO dto = new DashboardProfissionalDTO();

        // Buscar atletas do clube ou da equipe
        List<Atleta> atletas;
        if (equipeId != null && equipeId > 0) {
            Equipe equipe = equipeRepository.findById(equipeId).orElse(null);
            if (equipe != null && equipe.getClube().getId().equals(clubeId)) {
                atletas = equipe.getAtletas();
            } else {
                atletas = new ArrayList<>();
            }
        } else {
            atletas = atletaRepository.findByClubeId(clubeId);
        }

        List<Long> atletaIds = atletas.stream().map(Atleta::getId).collect(Collectors.toList());

        dto.setTotalAtletas(atletas.size());

        if (atletas.isEmpty()) {
            dto.setRankingPerformance(List.of());
            dto.setMapaRisco(List.of());
            dto.setSintomasRecorrentes(List.of());
            dto.setAlertasOutliers(List.of());
            dto.setTendenciaSemanal(List.of());
            preencherClima(dto, lat, lon);
            return dto;
        }

        LocalDate hoje = LocalDate.now();
        int diasPeriodo = dias != null && dias > 0 ? dias : 7;
        LocalDateTime inicio7Dias = hoje.minusDays(diasPeriodo).atStartOfDay(); // Mantemos o nome para evitar refatoração massiva
        LocalDateTime inicio14Dias = hoje.minusDays(Math.max(14, diasPeriodo)).atStartOfDay();
        LocalDateTime fimHoje = hoje.plusDays(1).atStartOfDay();

        // Buscar todas as sessões finalizadas
        List<SessaoDeTreino> sessoesTodas14d = sessaoRepository.findByAtletaIdInAndDataHoraFimBetween(atletaIds, inicio14Dias, fimHoje);
        List<SessaoDeTreino> sessoes7d = sessoesTodas14d.stream()
                .filter(s -> s.getDataHoraFim() != null && s.getDataHoraFim().isAfter(inicio7Dias))
                .collect(Collectors.toList());

        // ═══════════════════════════════════════════
        // SEÇÃO 1: VISÃO GERAL
        // ═══════════════════════════════════════════
        dto.setSessoesUltimos7Dias(sessoes7d.size());

        double somaTaxa = 0;
        double somaVariacao = 0;
        int countComTaxa = 0;
        int countComVariacao = 0;

        for (SessaoDeTreino s : sessoes7d) {
            if (s.getTaxaSudorese() != null) {
                somaTaxa += s.getTaxaSudorese();
                countComTaxa++;
            }
            Float pesoPre = s.getPesagemPre() != null ? s.getPesagemPre().getPeso() : null;
            Float pesoPos = s.getPesagemPos() != null ? s.getPesagemPos().getPeso() : null;
            if (pesoPre != null && pesoPos != null && pesoPre > 0) {
                somaVariacao += calculadora.calcularPercentualVariacaoMassa(pesoPre, pesoPos);
                countComVariacao++;
            }
        }

        dto.setTaxaMediaSudorese(countComTaxa > 0 ? Math.round((somaTaxa / countComTaxa) * 100.0) / 100.0 : 0.0);
        dto.setVariacaoMediaMassa(countComVariacao > 0 ? Math.round((somaVariacao / countComVariacao) * 100.0) / 100.0 : 0.0);

        // ═══════════════════════════════════════════
        // SEÇÃO 2: CLIMA
        // ═══════════════════════════════════════════
        preencherClima(dto, lat, lon);

        // ═══════════════════════════════════════════
        // SEÇÃO 3: RANKING PERFORMANCE HÍDRICA
        // ═══════════════════════════════════════════
        // Buscar TODAS as sessões de cada atleta (não apenas 7 dias)
        List<RankingAtletaRecord> ranking = new ArrayList<>();
        for (Atleta atleta : atletas) {
            List<SessaoDeTreino> sessoesAtleta = sessaoRepository.findByAtletaId(atleta.getId());
            List<SessaoDeTreino> sessoesFinalizadas = sessoesAtleta.stream()
                    .filter(s -> s.getDataHoraFim() != null && s.getTaxaSudorese() != null)
                    .collect(Collectors.toList());

            if (sessoesFinalizadas.isEmpty()) continue;

            int ideais = 0;
            for (SessaoDeTreino s : sessoesFinalizadas) {
                Float pesoPre = s.getPesagemPre() != null ? s.getPesagemPre().getPeso() : null;
                Float pesoPos = s.getPesagemPos() != null ? s.getPesagemPos().getPeso() : null;
                Float variacao = calculadora.calcularPercentualVariacaoMassa(pesoPre, pesoPos);
                if (variacao >= -1.0f && variacao <= 1.0f) {
                    ideais++;
                }
            }

            double percentual = (double) ideais / sessoesFinalizadas.size() * 100.0;
            ranking.add(new RankingAtletaRecord(
                    atleta.getId(), atleta.getNome(), atleta.getFotoPerfil(),
                    sessoesFinalizadas.size(), ideais,
                    Math.round(percentual * 10.0) / 10.0
            ));
        }
        ranking.sort((a, b) -> Double.compare(b.getPercentualIdeal(), a.getPercentualIdeal()));
        dto.setRankingPerformance(ranking.stream().limit(5).collect(Collectors.toList()));

        // ═══════════════════════════════════════════
        // SEÇÃO 4: MAPA DE RISCO
        // ═══════════════════════════════════════════
        List<AtletaRiscoRecord> mapaRisco = new ArrayList<>();
        int criticos = 0, atencao = 0, ideais2 = 0, superingestao = 0;

        for (Atleta atleta : atletas) {
            Optional<SessaoDeTreino> ultimaSessao = sessaoRepository
                    .findFirstByAtletaIdAndDataHoraFimIsNotNullAndTaxaSudoreseIsNotNullOrderByDataHoraFimDesc(atleta.getId());

            String status = "IDEAL";
            String statusColor = "#27AE60";
            Float variacao = 0f;
            Float taxa = 0f;
            String alerta = "";

            if (ultimaSessao.isPresent()) {
                SessaoDeTreino s = ultimaSessao.get();
                taxa = s.getTaxaSudorese() != null ? s.getTaxaSudorese() : 0f;
                Float pesoPre = s.getPesagemPre() != null ? s.getPesagemPre().getPeso() : null;
                Float pesoPos = s.getPesagemPos() != null ? s.getPesagemPos().getPeso() : null;
                variacao = calculadora.calcularPercentualVariacaoMassa(pesoPre, pesoPos);
                String rawStatus = calculadora.classificarStatusHidratacao(pesoPre, pesoPos);

                switch (rawStatus) {
                    case "CRITICAL":
                        status = "CRÍTICO";
                        statusColor = "#D90429";
                        alerta = "Hipoidratação crítica — perda ≥ 2%";
                        criticos++;
                        break;
                    case "WARNING":
                        status = "ATENÇÃO";
                        statusColor = "#F59E0B";
                        alerta = "Desidratação moderada — perda 1-2%";
                        atencao++;
                        break;
                    case "OVER_HYDRATION_CRITICAL":
                        status = "SUPERINGESTÃO";
                        statusColor = "#7C3AED";
                        alerta = "Risco de hiponatremia — ganho > 1%";
                        superingestao++;
                        break;
                    case "OVER_HYDRATION_WARNING":
                        status = "SUPERINGESTÃO";
                        statusColor = "#F97316";
                        alerta = "Ganho de peso — risco de superingestão";
                        superingestao++;
                        break;
                    default:
                        status = "IDEAL";
                        statusColor = "#27AE60";
                        ideais2++;
                        break;
                }
            } else {
                ideais2++;
            }

            mapaRisco.add(new AtletaRiscoRecord(
                    atleta.getId(), atleta.getNome(), atleta.getFotoPerfil(),
                    status, statusColor, variacao, taxa, alerta
            ));
        }

        // Ordenar: críticos primeiro, depois atenção, superingestão, ideal
        mapaRisco.sort((a, b) -> {
            Map<String, Integer> prioridade = Map.of("CRÍTICO", 0, "SUPERINGESTÃO", 1, "ATENÇÃO", 2, "IDEAL", 3);
            return Integer.compare(
                    prioridade.getOrDefault(a.getStatus(), 9),
                    prioridade.getOrDefault(b.getStatus(), 9)
            );
        });

        dto.setAtletasCriticos(criticos);
        dto.setAtletasAtencao(atencao);
        dto.setAtletasIdeais(ideais2);
        dto.setAtletasSuperingestao(superingestao);
        dto.setMapaRisco(mapaRisco);

        // ═══════════════════════════════════════════
        // SEÇÃO 5: SINTOMAS RECORRENTES
        // ═══════════════════════════════════════════
        Map<String, Integer> sintomaCount = new HashMap<>();
        int totalSessoesComSintoma = 0;

        for (SessaoDeTreino s : sessoesTodas14d) {
            // Analisar sintomas pós-treino
            if (s.getRegistroDeSintomaPos() != null && s.getRegistroDeSintomaPos().getSintomas() != null) {
                List<String> sintomas = parsearSintomasJson(s.getRegistroDeSintomaPos().getSintomas());
                if (!sintomas.isEmpty()) {
                    totalSessoesComSintoma++;
                    for (String sintoma : sintomas) {
                        String normalizado = sintoma.trim();
                        if (!normalizado.isEmpty()) {
                            sintomaCount.merge(normalizado, 1, Integer::sum);
                        }
                    }
                }
            }
            // Também analisar pré-treino
            if (s.getRegistroDeSintomaPre() != null && s.getRegistroDeSintomaPre().getSintomas() != null) {
                List<String> sintomas = parsearSintomasJson(s.getRegistroDeSintomaPre().getSintomas());
                for (String sintoma : sintomas) {
                    String normalizado = sintoma.trim();
                    if (!normalizado.isEmpty()) {
                        sintomaCount.merge(normalizado, 1, Integer::sum);
                    }
                }
            }
        }

        int totalSessoesRef = Math.max(sessoesTodas14d.size(), 1);
        List<SintomaFrequenciaRecord> sintomasOrdenados = sintomaCount.entrySet().stream()
                .map(e -> new SintomaFrequenciaRecord(
                        e.getKey(), e.getValue(),
                        Math.round((double) e.getValue() / totalSessoesRef * 100.0 * 10.0) / 10.0
                ))
                .sorted((a, b) -> Integer.compare(b.getOcorrencias(), a.getOcorrencias()))
                .limit(8)
                .collect(Collectors.toList());
        dto.setSintomasRecorrentes(sintomasOrdenados);

        // ═══════════════════════════════════════════
        // SEÇÃO 6: ALERTAS DE OUTLIERS
        // ═══════════════════════════════════════════
        DateTimeFormatter dtf = DateTimeFormatter.ofPattern("dd/MM/yyyy HH:mm");
        List<AlertaOutlierRecord> outliers = new ArrayList<>();

        for (SessaoDeTreino s : sessoesTodas14d) {
            if (s.getAtleta() == null) continue;

            // Taxa de sudorese implausível
            if (s.getTaxaSudorese() != null) {
                if (s.getTaxaSudorese() < 0.1f) {
                    outliers.add(new AlertaOutlierRecord(
                            s.getId(), s.getAtleta().getId(), s.getAtleta().getNome(),
                            "TAXA_MUITO_BAIXA",
                            "Taxa de sudorese " + String.format("%.2f", s.getTaxaSudorese()) + " L/h — valor atípico",
                            s.getDataHoraFim() != null ? s.getDataHoraFim().format(dtf) : ""
                    ));
                } else if (s.getTaxaSudorese() > 4.0f) {
                    outliers.add(new AlertaOutlierRecord(
                            s.getId(), s.getAtleta().getId(), s.getAtleta().getNome(),
                            "TAXA_MUITO_ALTA",
                            "Taxa de sudorese " + String.format("%.2f", s.getTaxaSudorese()) + " L/h — possível erro de medição",
                            s.getDataHoraFim() != null ? s.getDataHoraFim().format(dtf) : ""
                    ));
                }
            }

            // Variação de massa > 5%
            Float pesoPre = s.getPesagemPre() != null ? s.getPesagemPre().getPeso() : null;
            Float pesoPos = s.getPesagemPos() != null ? s.getPesagemPos().getPeso() : null;
            if (pesoPre != null && pesoPos != null && pesoPre > 0) {
                Float var = calculadora.calcularPercentualVariacaoMassa(pesoPre, pesoPos);
                if (Math.abs(var) > 5.0f) {
                    outliers.add(new AlertaOutlierRecord(
                            s.getId(), s.getAtleta().getId(), s.getAtleta().getNome(),
                            "VARIACAO_EXCESSIVA",
                            "Variação de massa " + String.format("%.1f", var) + "% — valor implausível",
                            s.getDataHoraFim() != null ? s.getDataHoraFim().format(dtf) : ""
                    ));
                }
            }
        }
        dto.setAlertasOutliers(outliers);


        // ═══════════════════════════════════════════
        // SEÇÃO 8: TENDÊNCIA SEMANAL
        // ═══════════════════════════════════════════
        List<TendenciaDiariaRecord> tendencia = new ArrayList<>();
        for (int i = 6; i >= 0; i--) {
            LocalDate data = hoje.minusDays(i);
            String label = getDiaSemana(data);
            LocalDateTime dayStart = data.atStartOfDay();
            LocalDateTime dayEnd = data.plusDays(1).atStartOfDay();

            List<SessaoDeTreino> sessoesDia = sessoes7d.stream()
                    .filter(s -> s.getDataHoraFim() != null
                            && !s.getDataHoraFim().isBefore(dayStart)
                            && s.getDataHoraFim().isBefore(dayEnd))
                    .collect(Collectors.toList());

            double somaBalanco = 0, somaTaxaDia = 0;
            int countBalanco = 0, countTaxaDia = 0;

            for (SessaoDeTreino s : sessoesDia) {
                if (s.getBalancoHidrico() != null) {
                    somaBalanco += s.getBalancoHidrico();
                    countBalanco++;
                }
                if (s.getTaxaSudorese() != null) {
                    somaTaxaDia += s.getTaxaSudorese();
                    countTaxaDia++;
                }
            }

            tendencia.add(new TendenciaDiariaRecord(
                    label,
                    countBalanco > 0 ? Math.round((somaBalanco / countBalanco) * 100.0) / 100.0 : 0.0,
                    countTaxaDia > 0 ? Math.round((somaTaxaDia / countTaxaDia) * 100.0) / 100.0 : 0.0,
                    sessoesDia.size()
            ));
        }
        dto.setTendenciaSemanal(tendencia);

        return dto;
    }

    // ─── MÉTODOS AUXILIARES ───

    private void preencherClima(DashboardProfissionalDTO dto, Double lat, Double lon) {
        try {
            // Fallback: São Caetano do Sul
            double latitude = lat != null ? lat : -23.6183;
            double longitude = lon != null ? lon : -46.5502;
            WeatherResponseDTO clima = weatherService.getClima(latitude, longitude);
            dto.setTemperaturaAtual(clima.getTemperatura());
            dto.setUmidadeAtual(clima.getUmidade());
            dto.setDescricaoClima(clima.getDescricao());
            dto.setAumentoSudoresePercent(clima.getAumentoSudoresePercent());
            dto.setAguaRecomendadaLitros(clima.getAguaRecomendadaLitros());
        } catch (Exception e) {
            // Se a API do clima falhar, não travar o dashboard
            dto.setDescricaoClima("Indisponível");
        }
    }

    private List<String> parsearSintomasJson(String sintomasRaw) {
        if (sintomasRaw == null || sintomasRaw.isBlank()) return List.of();
        sintomasRaw = sintomasRaw.trim();
        List<String> list = new ArrayList<>();

        if (sintomasRaw.contains("{") || sintomasRaw.contains("[")) {
            try {
                if (sintomasRaw.startsWith("{")) {
                    Map<String, Object> map = objectMapper.readValue(sintomasRaw, new TypeReference<Map<String, Object>>() {});
                    if (map.containsKey("selecionados") && map.get("selecionados") instanceof List) {
                        List<?> sel = (List<?>) map.get("selecionados");
                        for (Object item : sel) {
                            if (item != null) list.add(item.toString());
                        }
                    }
                    if (map.containsKey("outros") && map.get("outros") != null) {
                        String outros = map.get("outros").toString().trim();
                        if (!outros.isEmpty()) list.add(outros);
                    }
                    return list;
                } else if (sintomasRaw.startsWith("[")) {
                    return objectMapper.readValue(sintomasRaw, new TypeReference<List<String>>() {});
                }
            } catch (Exception e) {
                // Fallback robusto de regex se o JSON estiver truncado ou malformado
            }

            java.util.regex.Pattern pattern = java.util.regex.Pattern.compile("\"([^\"]+)\"");
            java.util.regex.Matcher matcher = pattern.matcher(sintomasRaw);
            while (matcher.find()) {
                String match = matcher.group(1).trim();
                if (!match.equals("selecionados") && !match.equals("outros") && !match.equals("selecionado") && !match.isEmpty()) {
                    list.add(match);
                }
            }
            if (!list.isEmpty()) {
                return list;
            }
        }

        return Arrays.stream(sintomasRaw.split(","))
                .map(String::trim)
                .filter(s -> !s.isEmpty())
                .collect(Collectors.toList());
    }

    private String getDiaSemana(LocalDate date) {
        return switch (date.getDayOfWeek()) {
            case MONDAY -> "SEG";
            case TUESDAY -> "TER";
            case WEDNESDAY -> "QUA";
            case THURSDAY -> "QUI";
            case FRIDAY -> "SEX";
            case SATURDAY -> "SÁB";
            case SUNDAY -> "DOM";
        };
    }
}
