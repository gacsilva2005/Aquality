package com.hydrasense.schydrasense.service;

import com.hydrasense.schydrasense.dto.IniciarTreinoDTO;
import com.hydrasense.schydrasense.dto.PesagemPosTreinoDTO;
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

    public SessaoDeTreinoService(
            SessaoDeTreinoRepository sessaoRepository,
            AtletaRepository atletaRepository,
            RegistroDoPesoRepository pesoRepository
    ) {
        this.repository = sessaoRepository;
        this.atletaRepository = atletaRepository;
        this.pesoRepository = pesoRepository;
    }

    public SessaoDeTreino salvar(SessaoDeTreino sessao) {
        prepararRegistroDeHidratacao(sessao);
        return repository.save(sessao);
    }

    public List<SessaoDeTreino> listarTodas() {
        return repository.findAll();
    }

    public SessaoDeTreino buscarPorId(Long sessaoId) {
        return repository.findById(sessaoId)
                .orElseThrow(() -> new RuntimeException("Sessão não encontrada"));
    }

    public void deletar(Long id) {
        repository.deleteById(id);
    }

    public SessaoDeTreino atualizar(Long id, SessaoDeTreino novaSessao) {
        return repository.findById(id)
                .map(sessao -> {
                    sessao.setDataHoraInicio(novaSessao.getDataHoraInicio());
                    sessao.setDataHoraFim(novaSessao.getDataHoraFim());
                    sessao.setDistanciaPercorrida(novaSessao.getDistanciaPercorrida());
                    sessao.setModalidade(novaSessao.getModalidade());
                    sessao.setIntensidadePercebida(novaSessao.getIntensidadePercebida());
                    prepararRegistroDeHidratacao(sessao);
                    return repository.save(sessao);
                })
                .orElseThrow(() -> new RuntimeException("Sessão não encontrada"));
    }

    public SessaoDeTreino iniciarTreino(IniciarTreinoDTO dto) {

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

        return repository.save(sessao);
    }

    public SessaoDeTreino registrarPesagemPos(Long sessaoId, PesagemPosTreinoDTO dto) {

        SessaoDeTreino sessao = repository.findById(sessaoId)
                .orElseThrow(() -> new RuntimeException("Sessão não encontrada"));

        RegistroDoPeso pesagemPos = new RegistroDoPeso();
        pesagemPos.setPeso(dto.pesoPosTreino());

        pesoRepository.save(pesagemPos);

        sessao.setPesagemPos(pesagemPos);

        if (dto.hidratacaoMl() != null && dto.hidratacaoMl() > 0) {

            RegistroDeHidratacao hidratacao = new RegistroDeHidratacao();

            hidratacao.setVolume(dto.hidratacaoMl().floatValue());
            hidratacao.setTipoFluido("ÁGUA MINERAL");
            hidratacao.setAtleta(sessao.getAtleta());
            hidratacao.setDataHora(java.time.LocalDateTime.now());

            sessao.setRegistroDeHidratacao(hidratacao);
        }

        sessao.finalizarTreino();
        prepararRegistroDeHidratacao(sessao);

        return repository.save(sessao);
    }

    private void prepararRegistroDeHidratacao(SessaoDeTreino sessao) {
        if (sessao.getRegistroDeHidratacao() != null) {
            RegistroDeHidratacao hidratacao = sessao.getRegistroDeHidratacao();
            if (hidratacao.getDataHora() == null) {
                hidratacao.setDataHora(sessao.getDataHoraFim() != null ? sessao.getDataHoraFim() : java.time.LocalDateTime.now());
            }
            if (hidratacao.getAtleta() == null && sessao.getAtleta() != null) {
                hidratacao.setAtleta(sessao.getAtleta());
            }
        }
    }

    public List<SessaoDeTreino> listarPorAtleta(Long atletaId) {
        return repository.findByAtletaId(atletaId);
    }
}