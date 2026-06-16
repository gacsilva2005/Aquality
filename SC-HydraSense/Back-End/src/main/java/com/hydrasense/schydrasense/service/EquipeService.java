package com.hydrasense.schydrasense.service;

import com.hydrasense.schydrasense.dto.EquipeResponseDTO;
import com.hydrasense.schydrasense.dto.EquipeDashboardResponseDTO;
import com.hydrasense.schydrasense.model.Atleta;
import com.hydrasense.schydrasense.model.Clube;
import com.hydrasense.schydrasense.model.Equipe;
import com.hydrasense.schydrasense.model.SessaoDeTreino;
import com.hydrasense.schydrasense.repository.AtletaRepository;
import com.hydrasense.schydrasense.repository.ClubeRepository;
import com.hydrasense.schydrasense.repository.EquipeRepository;
import com.hydrasense.schydrasense.repository.RegistroDeHidratacaoRepository;
import com.hydrasense.schydrasense.repository.SessaoDeTreinoRepository;
import org.springframework.stereotype.Service;

import com.fasterxml.jackson.databind.ObjectMapper;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.HashSet;
import java.util.List;
import java.util.Optional;
import java.util.Set;
import java.util.stream.Collectors;

@Service
public class EquipeService {

    private final EquipeRepository equipeRepository;
    private final ClubeRepository clubeRepository;
    private final AtletaRepository atletaRepository;
    private final RegistroDeHidratacaoRepository registroDeHidratacaoRepository;
    private final SessaoDeTreinoRepository sessaoDeTreinoRepository;
    private final CalculadoraFisiologica calculadoraFisiologica;

    public EquipeService(
            EquipeRepository equipeRepository,
            ClubeRepository clubeRepository,
            AtletaRepository atletaRepository,
            RegistroDeHidratacaoRepository registroDeHidratacaoRepository,
            SessaoDeTreinoRepository sessaoDeTreinoRepository,
            CalculadoraFisiologica calculadoraFisiologica
    ) {
        this.equipeRepository = equipeRepository;
        this.clubeRepository = clubeRepository;
        this.atletaRepository = atletaRepository;
        this.registroDeHidratacaoRepository = registroDeHidratacaoRepository;
        this.sessaoDeTreinoRepository = sessaoDeTreinoRepository;
        this.calculadoraFisiologica = calculadoraFisiologica;
    }

    public Equipe criarEquipe(String nome, String categoria, Integer limiteAtletas, Long clubeId, List<Long> atletasIds) {
        Equipe equipe = new Equipe();
        equipe.setNome(nome);
        equipe.setCategoria(categoria);
        equipe.setLimiteAtletas(limiteAtletas);

        Clube clube = clubeRepository.findById(clubeId)
                .orElseThrow(() -> new RuntimeException("Clube não encontrado"));
        equipe.setClube(clube);

        if (atletasIds != null && !atletasIds.isEmpty()) {
            List<Atleta> atletas = atletaRepository.findAllById(atletasIds);
            equipe.setAtletas(atletas);
        }

        Equipe equipeSalva = equipeRepository.save(equipe);

        if (atletasIds != null && !atletasIds.isEmpty()) {
            for (Long atletaId : atletasIds) {
                recalcularModalidadesAtleta(atletaId);
            }
        }

        return equipeSalva;
    }

    public Equipe atualizarEquipe(Long id, String nome, String categoria, Integer limiteAtletas, List<Long> atletasIds) {
        Equipe equipe = equipeRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Equipe não encontrada"));

        List<Long> oldAtletasIds = equipe.getAtletas().stream().map(Atleta::getId).collect(Collectors.toList());

        equipe.setNome(nome);
        equipe.setCategoria(categoria);
        equipe.setLimiteAtletas(limiteAtletas);

        if (atletasIds != null) {
            List<Atleta> atletas = atletaRepository.findAllById(atletasIds);
            equipe.setAtletas(atletas);
        } else {
            equipe.getAtletas().clear();
        }

        Equipe equipeSalva = equipeRepository.save(equipe);

        Set<Long> todosAtletasIds = new HashSet<>(oldAtletasIds);
        if (atletasIds != null) {
            todosAtletasIds.addAll(atletasIds);
        }

        for (Long atletaId : todosAtletasIds) {
            recalcularModalidadesAtleta(atletaId);
        }

        return equipeSalva;
    }

    public List<Equipe> listarTodas() {
        return equipeRepository.findAll();
    }

    public List<Equipe> listarPorClube(Long clubeId) {
        return equipeRepository.findByClubeId(clubeId);
    }

    public List<EquipeResponseDTO> listarResumosPorClube(Long clubeId) {
        List<Equipe> equipes = equipeRepository.findByClubeId(clubeId);
        return equipes.stream()
                .map(this::obterResumoEquipe)
                .collect(Collectors.toList());
    }

    public List<EquipeResponseDTO> listarTodosResumos() {
        List<Equipe> equipes = equipeRepository.findAll();
        return equipes.stream()
                .map(this::obterResumoEquipe)
                .collect(Collectors.toList());
    }

    public EquipeResponseDTO obterResumoEquipe(Equipe equipe) {
        List<Atleta> atletas = equipe.getAtletas();
        int N = atletas.size();

        double totalTodayVolume = 0.0;
        double totalSweatRate = 0.0;
        int athletesWithSweatRate = 0;

        LocalDate today = LocalDate.now();
        LocalDateTime startOfDay = today.atStartOfDay();
        LocalDateTime endOfDay = today.plusDays(1).atStartOfDay();

        for (Atleta atleta : atletas) {
            Double athleteTodayVolume = registroDeHidratacaoRepository.sumVolumeByAtletaIdAndDateRange(atleta.getId(), startOfDay, endOfDay);
            if (athleteTodayVolume != null) {
                totalTodayVolume += athleteTodayVolume;
            }

            Optional<SessaoDeTreino> latestSessionOpt = sessaoDeTreinoRepository.findFirstByAtletaIdAndDataHoraFimIsNotNullAndTaxaSudoreseIsNotNullOrderByDataHoraFimDesc(atleta.getId());
            if (latestSessionOpt.isPresent()) {
                totalSweatRate += latestSessionOpt.get().getTaxaSudorese();
                athletesWithSweatRate++;
            }
        }

        double adherence = 0.0;
        if (N > 0) {
            adherence = totalTodayVolume / (3000.0 * N);
            adherence = Math.max(0.0, Math.min(1.0, adherence));
        }

        double avgSweatRate = 0.0;
        if (athletesWithSweatRate > 0) {
            avgSweatRate = totalSweatRate / athletesWithSweatRate;
        }

        return new EquipeResponseDTO(equipe, adherence, avgSweatRate);
    }

    public Optional<Equipe> buscarPorId(Long id) {
        return equipeRepository.findById(id);
    }

    public void deletar(Long id) {
        Equipe equipe = equipeRepository.findById(id).orElse(null);
        if (equipe != null) {
            List<Long> atletasIds = equipe.getAtletas().stream().map(Atleta::getId).collect(Collectors.toList());
            equipeRepository.deleteById(id);
            for (Long atletaId : atletasIds) {
                recalcularModalidadesAtleta(atletaId);
            }
        }
    }

    private void recalcularModalidadesAtleta(Long atletaId) {
        Atleta atleta = atletaRepository.findById(atletaId).orElse(null);
        if (atleta == null) return;

        List<Equipe> equipesDoAtleta = equipeRepository.findByAtletas_Id(atletaId);
        Set<String> modalidades = new HashSet<>();
        for (Equipe eq : equipesDoAtleta) {
            if (eq.getCategoria() != null && !eq.getCategoria().trim().isEmpty()) {
                modalidades.add(eq.getCategoria());
            }
        }

        try {
            ObjectMapper mapper = new ObjectMapper();
            atleta.setModalidade(mapper.writeValueAsString(modalidades));
            atletaRepository.save(atleta);
        } catch (Exception e) {
            e.printStackTrace();
        }
    }

    public EquipeDashboardResponseDTO obterDashboardEquipe(Long equipeId) {
        Equipe equipe = equipeRepository.findById(equipeId)
                .orElseThrow(() -> new RuntimeException("Equipe não encontrada"));

        EquipeDashboardResponseDTO dto = new EquipeDashboardResponseDTO();
        dto.setId(equipe.getId());
        dto.setNome(equipe.getNome());

        List<Atleta> atletas = equipe.getAtletas();

        LocalDate today = LocalDate.now();
        LocalDateTime startOfToday = today.atStartOfDay();
        LocalDateTime endOfToday = today.plusDays(1).atStartOfDay();

        LocalDate yesterday = today.minusDays(1);
        LocalDateTime startOfYesterday = yesterday.atStartOfDay();
        LocalDateTime endOfYesterday = today.atStartOfDay();

        double totalTodayVolume = 0.0;
        double totalYesterdayVolume = 0.0;

        for (Atleta atleta : atletas) {
            Double athleteTodayVolume = registroDeHidratacaoRepository.sumVolumeByAtletaIdAndDateRange(atleta.getId(), startOfToday, endOfToday);
            if (athleteTodayVolume != null) {
                totalTodayVolume += athleteTodayVolume;
            }

            Double athleteYesterdayVolume = registroDeHidratacaoRepository.sumVolumeByAtletaIdAndDateRange(atleta.getId(), startOfYesterday, endOfYesterday);
            if (athleteYesterdayVolume != null) {
                totalYesterdayVolume += athleteYesterdayVolume;
            }
        }

        dto.setHidratacaoTotalHoje(Math.round((totalTodayVolume / 1000.0) * 10.0) / 10.0);

        double variacao = 0.0;
        if (totalYesterdayVolume > 0) {
            variacao = ((totalTodayVolume - totalYesterdayVolume) / totalYesterdayVolume) * 100.0;
        } else if (totalTodayVolume > 0) {
            variacao = 100.0;
        }
        dto.setHidratacaoVariacaoOntem(Math.round(variacao * 10.0) / 10.0);

        double totalSweatRate = 0.0;
        int athletesWithSweatRate = 0;
        int criticoCount = 0;

        EquipeDashboardResponseDTO.StatusDistDTO statusDist = new EquipeDashboardResponseDTO.StatusDistDTO();
        java.util.List<EquipeDashboardResponseDTO.AtletaDashboardDTO> atletasList = new java.util.ArrayList<>();

        for (Atleta atleta : atletas) {
            EquipeDashboardResponseDTO.AtletaDashboardDTO atletaDTO = new EquipeDashboardResponseDTO.AtletaDashboardDTO();
            atletaDTO.setId(atleta.getId());
            atletaDTO.setNome(atleta.getNome());
            atletaDTO.setRole(formatarModalidade(atleta.getModalidade()));
            atletaDTO.setAvatar(atleta.getFotoPerfil());

            Double athleteTodayVolume = registroDeHidratacaoRepository.sumVolumeByAtletaIdAndDateRange(atleta.getId(), startOfToday, endOfToday);
            double volL = athleteTodayVolume != null ? athleteTodayVolume / 1000.0 : 0.0;
            atletaDTO.setVol(Math.round(volL * 10.0) / 10.0);
            atletaDTO.setMaxVol("3.0L");
            double progress = (volL / 3.0) * 100.0;
            atletaDTO.setProgress(Math.min(100.0, Math.round(progress * 10.0) / 10.0));

            Optional<SessaoDeTreino> latestSessionOpt = sessaoDeTreinoRepository.findFirstByAtletaIdAndDataHoraFimIsNotNullAndTaxaSudoreseIsNotNullOrderByDataHoraFimDesc(atleta.getId());
            String rawStatus = "OPTIMAL";
            if (latestSessionOpt.isPresent()) {
                SessaoDeTreino s = latestSessionOpt.get();
                if (s.getTaxaSudorese() != null) {
                    totalSweatRate += s.getTaxaSudorese();
                    athletesWithSweatRate++;
                }

                Float pesoPre = s.getPesagemPre() != null ? s.getPesagemPre().getPeso() : null;
                Float pesoPos = s.getPesagemPos() != null ? s.getPesagemPos().getPeso() : null;
                rawStatus = calculadoraFisiologica.classificarStatusHidratacao(pesoPre, pesoPos);
            }

            if ("CRITICAL".equals(rawStatus) || "OVER_HYDRATION_CRITICAL".equals(rawStatus)) {
                atletaDTO.setStatus("CRÍTICO");
                atletaDTO.setStatusColor("#D90429");
                statusDist.setCritico(statusDist.getCritico() + 1);
                criticoCount++;
            } else if ("WARNING".equals(rawStatus) || "OVER_HYDRATION_WARNING".equals(rawStatus)) {
                atletaDTO.setStatus("ATENÇÃO");
                atletaDTO.setStatusColor("#F5A623");
                statusDist.setAtencao(statusDist.getAtencao() + 1);
            } else {
                atletaDTO.setStatus("ÓTIMO");
                atletaDTO.setStatusColor("#27AE60");
                statusDist.setOtimo(statusDist.getOtimo() + 1);
            }

            atletasList.add(atletaDTO);
        }

        dto.setAtletas(atletasList);
        dto.setStatusCriticoCount(criticoCount);
        dto.setStatusDist(statusDist);

        double avgSweatRate = athletesWithSweatRate > 0 ? totalSweatRate / athletesWithSweatRate : 0.0;
        dto.setTaxaMediaSudorese(Math.round(avgSweatRate * 10.0) / 10.0);

        java.util.List<EquipeDashboardResponseDTO.GraficoPontoDTO> grafico = new java.util.ArrayList<>();
        List<Long> atletaIds = atletas.stream().map(Atleta::getId).collect(Collectors.toList());

        for (int i = 6; i >= 0; i--) {
            LocalDate date = today.minusDays(i);
            String label = getDiaSemanaAbreviado(date);

            double balance = 0.0;
            if (!atletaIds.isEmpty()) {
                LocalDateTime dayStart = date.atStartOfDay();
                LocalDateTime dayEnd = date.plusDays(1).atStartOfDay();

                List<SessaoDeTreino> sessoes = sessaoDeTreinoRepository.findByAtletaIdInAndDataHoraFimBetween(atletaIds, dayStart, dayEnd);
                double sum = 0.0;
                int count = 0;
                for (SessaoDeTreino s : sessoes) {
                    if (s.getBalancoHidrico() != null) {
                        sum += s.getBalancoHidrico();
                        count++;
                    }
                }
                balance = count > 0 ? sum / count : 0.0;
            }
            balance = Math.round(balance * 100.0) / 100.0;
            grafico.add(new EquipeDashboardResponseDTO.GraficoPontoDTO(label, balance));
        }
        dto.setGraficoBalanco(grafico);

        return dto;
    }

    private String formatarModalidade(String rawModalidade) {
        if (rawModalidade == null || rawModalidade.isBlank()) {
            return "Atleta";
        }
        if (rawModalidade.startsWith("[")) {
            return rawModalidade.replaceAll("[\\[\\]\"']", "").replace(",", ", ");
        }
        return rawModalidade;
    }

    private String getDiaSemanaAbreviado(LocalDate date) {
        switch (date.getDayOfWeek()) {
            case MONDAY: return "SEG";
            case TUESDAY: return "TER";
            case WEDNESDAY: return "QUA";
            case THURSDAY: return "QUI";
            case FRIDAY: return "SEX";
            case SATURDAY: return "SÁB";
            case SUNDAY: return "DOM";
            default: return "";
        }
    }
}
