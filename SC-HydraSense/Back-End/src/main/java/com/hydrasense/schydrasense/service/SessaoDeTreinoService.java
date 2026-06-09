package com.hydrasense.schydrasense.service;

import com.hydrasense.schydrasense.dto.*;
import com.hydrasense.schydrasense.model.*;
import com.hydrasense.schydrasense.repository.AtletaRepository;
import com.hydrasense.schydrasense.repository.KitRepository;
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
    private final KitRepository kitRepository;

    public SessaoDeTreinoService(
            SessaoDeTreinoRepository sessaoRepository,
            AtletaRepository atletaRepository,
            RegistroDoPesoRepository pesoRepository,
            CalculadoraFisiologica calculadoraFisiologica,
            KitRepository kitRepository
    ) {
        this.repository = sessaoRepository;
        this.atletaRepository = atletaRepository;
        this.pesoRepository = pesoRepository;
        this.calculadoraFisiologica = calculadoraFisiologica;
        this.kitRepository = kitRepository;
    }

    private SessaoTreinoResponseDTO mapToResponseDTO(SessaoDeTreino sessao) {
        Float pesoPre = (sessao.getPesagemPre() != null) ? sessao.getPesagemPre().getPeso() : null;
        Float pesoPos = (sessao.getPesagemPos() != null) ? sessao.getPesagemPos().getPeso() : null;
        String sintomas = sessao.getRegistroDeSintoma() != null ? sessao.getRegistroDeSintoma().getSintomas() : null;
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
                statusHidratacao,
                sintomas,
                sessao.getChecklistBexiga(),
                sessao.getChecklistBalancaCorreta(),
                sessao.getChecklistSuperficiePlana(),
                sessao.getChecklistVestimentaCorreta(),
                sessao.getChecklistSemCalcados()
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

        SessaoDeTreino sessao = new SessaoDeTreino();
        sessao.setAtleta(atleta);
        sessao.setModalidade(dto.modalidade());
        sessao.iniciarTreino();

        boolean usarEquipamento = Boolean.TRUE.equals(dto.usarEquipamento());
        sessao.setUsouEquipamento(usarEquipamento);

        if (usarEquipamento && dto.kitId() != null) {
            Kit kit = kitRepository.findById(dto.kitId())
                    .orElseThrow(() -> new RuntimeException("Kit não encontrado: " + dto.kitId()));
            sessao.setKit(kit);
        }
        // ──────────────────────────────────────────────────────────────────────

        SessaoDeTreino salva = repository.save(sessao);
        return mapToResponseDTO(salva);
    }

    public SessaoTreinoResponseDTO finalizarSessao(Long sessaoId, FinalizarSessaoRequestDTO dto) {

        SessaoDeTreino sessao = repository.findById(sessaoId)
                .orElseThrow(() -> new RuntimeException("Sessão não encontrada"));

        RegistroDoPeso pesagemPos = new RegistroDoPeso();
        pesagemPos.setPeso(dto.getPesoPosTreino());

        pesoRepository.save(pesagemPos);

        RegistroDeHidratacao hidratacao = null;
        if (dto.getSede() != null && dto.getHidratacaoMl() > 0) {
            hidratacao = new RegistroDeHidratacao();
            hidratacao.setVolume(dto.getHidratacaoMl().floatValue());
            hidratacao.setTipoFluido("ÁGUA MINERAL (TREINO)");
            hidratacao.setAtleta(sessao.getAtleta());
            hidratacao.setDataHora(java.time.LocalDateTime.now());
        }

        sessao.finalizar(pesagemPos, hidratacao, dto.getDuracaoSegundos(), calculadoraFisiologica);

        repository.save(sessao);

        return mapToResponseDTO(sessao);
    }

    public List<SessaoTreinoResponseDTO> listarPorAtleta(Long atletaId) {
        return repository.findByAtletaId(atletaId).stream()
                .map(this::mapToResponseDTO)
                .toList();
    }

    public SessaoTreinoResponseDTO registrarPreTreino(Long sessaoId, PesagemPreTreinoDTO dto) {

        SessaoDeTreino sessao = repository.findById(sessaoId)
                .orElseThrow(() -> new RuntimeException("Sessão não encontrada"));

        RegistroDoPeso pesagemPre = new RegistroDoPeso();
        pesagemPre.setPeso(dto.getPesoPreTreino());
        pesagemPre.setDataHora(java.time.LocalDateTime.now());

        pesoRepository.save(pesagemPre);

        sessao.setPesagemPre(pesagemPre);

        if (dto.getSintomas() != null && !dto.getSintomas().isBlank()) {
            RegistroDeSintoma registroSintoma = new RegistroDeSintoma();

            registroSintoma.setSintomas(dto.getSintomas());
            registroSintoma.setDataHora(java.time.LocalDateTime.now());

            registroSintoma.setSessaoDeTreino(sessao);
            sessao.setRegistroDeSintoma(registroSintoma);
        }

        if (dto.getChecklist() != null) {
            PesagemPreTreinoDTO.ChecklistDTO c = dto.getChecklist();
            sessao.setChecklistBexiga(           Boolean.TRUE.equals(c.getBexiga()));
            sessao.setChecklistBalancaCorreta(   Boolean.TRUE.equals(c.getBalancaCorreta()));
            sessao.setChecklistSuperficiePlana(  Boolean.TRUE.equals(c.getSuperficiePlana()));
            sessao.setChecklistVestimentaCorreta(Boolean.TRUE.equals(c.getVestimentaCorreta()));
            sessao.setChecklistSemCalcados(      Boolean.TRUE.equals(c.getSemCalcados()));
            sessao.setChecklistSemAcessorios(    Boolean.TRUE.equals(c.getSemAcessorios()));
        }

        SessaoDeTreino salva = repository.save(sessao);
        return mapToResponseDTO(salva);
    }
}