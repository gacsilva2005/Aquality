package com.hydrasense.schydrasense.service;

import com.hydrasense.schydrasense.dto.*;
import com.hydrasense.schydrasense.model.Atleta;
import com.hydrasense.schydrasense.model.RegistroDeHidratacao;
import com.hydrasense.schydrasense.model.RegistroDoPeso;
import com.hydrasense.schydrasense.model.SessaoDeTreino;
import com.hydrasense.schydrasense.repository.AtletaRepository;
import com.hydrasense.schydrasense.repository.RegistroDoPesoRepository;
import com.hydrasense.schydrasense.repository.SessaoDeTreinoRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class SessaoDeTreinoService {

    private final SessaoDeTreinoRepository repository;
    private final AtletaRepository atletaRepository;
    private final RegistroDoPesoRepository pesoRepository;
    private final CalculadoraFisiologica calculadoraFisiologica;

    public SessaoDeTreinoService(
            SessaoDeTreinoRepository sessaoRepository,
            AtletaRepository atletaRepository,
            RegistroDoPesoRepository pesoRepository,
            CalculadoraFisiologica calculadoraFisiologica
    ) {
        this.repository = sessaoRepository;
        this.atletaRepository = atletaRepository;
        this.pesoRepository = pesoRepository;
        this.calculadoraFisiologica = calculadoraFisiologica;
    }

    private SessaoTreinoResponseDTO mapToResponseDTO(SessaoDeTreino sessao) {
        Float pesoPre = (sessao.getPesagemPre() != null) ? sessao.getPesagemPre().getPeso() : null;
        Float pesoPos = (sessao.getPesagemPos() != null) ? sessao.getPesagemPos().getPeso() : null;
        Integer hidratacaoMl = (sessao.getRegistroDeHidratacao() != null) ? sessao.getRegistroDeHidratacao().getVolume().intValue() : null;
        
        Integer duracaoSegundos = 0;
        if (sessao.getDataHoraInicio() != null && sessao.getDataHoraFim() != null) {
            duracaoSegundos = (int) java.time.Duration.between(sessao.getDataHoraInicio(), sessao.getDataHoraFim()).toSeconds();
        }

        String statusHidratacao = calculadoraFisiologica.classificarStatusHidratacao(pesoPre, pesoPos);

        return new SessaoTreinoResponseDTO(
                sessao.getId(),
                sessao.getDataHoraInicio(),
                sessao.getDataHoraFim(),
                sessao.getModalidade(),
                duracaoSegundos,
                pesoPre,
                pesoPos,
                hidratacaoMl,
                sessao.getTaxaSudorese(),
                sessao.getBalancoHidrico(),
                statusHidratacao
        );
    }

    public SessaoTreinoResponseDTO salvar(SessaoDeTreino sessao) {
        SessaoDeTreino salva = repository.save(sessao);
        return mapToResponseDTO(salva);
    }

    public List<SessaoTreinoResponseDTO> listarTodas() {
        return repository.findAll().stream()
                .map(this::mapToResponseDTO)
                .toList();
    }

    public SessaoTreinoResponseDTO buscarPorId(Long sessaoId) {
        SessaoDeTreino s = repository.findById(sessaoId)
                .orElseThrow(() -> new RuntimeException("Sessão não encontrada"));
        return mapToResponseDTO(s);
    }

    public void deletar(Long id) {
        repository.deleteById(id);
    }

    public SessaoTreinoResponseDTO atualizar(Long id, SessaoDeTreino novaSessao) {
        SessaoDeTreino s = repository.findById(id)
                .map(sessao -> {
                    sessao.setDataHoraInicio(novaSessao.getDataHoraInicio());
                    sessao.setDataHoraFim(novaSessao.getDataHoraFim());
                    sessao.setDistanciaPercorrida(novaSessao.getDistanciaPercorrida());
                    sessao.setModalidade(novaSessao.getModalidade());
                    sessao.setIntensidadePercebida(novaSessao.getIntensidadePercebida());
                    return repository.save(sessao);
                })
                .orElseThrow(() -> new RuntimeException("Sessão não encontrada"));
        return mapToResponseDTO(s);
    }

    public SessaoTreinoResponseDTO iniciarTreino(IniciarTreinoRequestDTO dto) {

        Atleta atleta = atletaRepository.findById(dto.atletaId())
                .orElseThrow(() -> new RuntimeException("Atleta não encontrado"));

        RegistroDoPeso pesagemPre = new RegistroDoPeso();
        pesagemPre.setPeso(dto.pesoPreTreino());

        pesoRepository.save(pesagemPre);

        SessaoDeTreino sessao = new SessaoDeTreino();

        sessao.setAtleta(atleta);
        sessao.setModalidade(dto.modalidade());
        sessao.setPesagemPre(pesagemPre);

        sessao.iniciarTreino();

        SessaoDeTreino salva = repository.save(sessao);
        return mapToResponseDTO(salva);
    }

    public SessaoTreinoResponseDTO finalizarSessao(Long sessaoId, FinalizarSessaoRequestDTO dto) {

        SessaoDeTreino sessao = repository.findById(sessaoId)
                .orElseThrow(() -> new RuntimeException("Sessão não encontrada"));

        RegistroDoPeso pesagemPos = new RegistroDoPeso();
        pesagemPos.setPeso(dto.pesoPosTreino());

        pesoRepository.save(pesagemPos);

        sessao.setPesagemPos(pesagemPos);

        if (dto.hidratacaoMl() != null && dto.hidratacaoMl() > 0) {

            RegistroDeHidratacao hidratacao = new RegistroDeHidratacao();

            hidratacao.setVolume(dto.hidratacaoMl().floatValue());
            hidratacao.setTipoFluido("ÁGUA MINERAL (TREINO)");
            hidratacao.setAtleta(sessao.getAtleta());
            hidratacao.setDataHora(java.time.LocalDateTime.now());

            sessao.setRegistroDeHidratacao(hidratacao);
        }
        if (dto.duracaoSegundos() != null && dto.duracaoSegundos() > 0) {
            sessao.setDataHoraFim(sessao.getDataHoraInicio().plusSeconds(dto.duracaoSegundos()));
        } else {
            sessao.finalizarTreino();
        }

        Float pesoPre = (sessao.getPesagemPre() != null) ? sessao.getPesagemPre().getPeso() : 0.0f;
        Float pesoPos = dto.pesoPosTreino() != null ? dto.pesoPosTreino() : 0.0f;
        Integer hidratacaoMl = (dto.hidratacaoMl() != null) ? dto.hidratacaoMl() : 0;
        long duracaoMinutos = sessao.calcularDuracaoTotal();
        Double duracaoMinutosPrecisos = (dto.duracaoSegundos() != null && dto.duracaoSegundos() > 0)
                ? dto.duracaoSegundos() / 60.0
                : (double) duracaoMinutos;

        Float taxaSudorese = calculadoraFisiologica.calcularTaxaSudorese(pesoPre, pesoPos, hidratacaoMl, duracaoMinutosPrecisos);
        Float balancoHidrico = calculadoraFisiologica.calcularBalancoHidrico(pesoPre, pesoPos);
        String statusHidratacao = calculadoraFisiologica.classificarStatusHidratacao(pesoPre, pesoPos);

        sessao.setTaxaSudorese(taxaSudorese);
        sessao.setBalancoHidrico(balancoHidrico);

        repository.save(sessao);

        return mapToResponseDTO(sessao);
    }

    public List<SessaoTreinoResponseDTO> listarPorAtleta(Long atletaId) {
        return repository.findByAtletaId(atletaId).stream()
                .map(this::mapToResponseDTO)
                .toList();
    }
}