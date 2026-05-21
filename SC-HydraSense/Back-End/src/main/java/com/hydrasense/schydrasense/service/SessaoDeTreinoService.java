package com.hydrasense.schydrasense.service;

import com.hydrasense.schydrasense.model.SessaoDeTreino;
import com.hydrasense.schydrasense.repository.SessaoDeTreinoRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class SessaoDeTreinoService {

    private final SessaoDeTreinoRepository repository;

    public SessaoDeTreinoService(SessaoDeTreinoRepository repository) {
        this.repository = repository;
    }

    public SessaoDeTreino salvar(SessaoDeTreino sessao) {
        return repository.save(sessao);
    }

    public List<SessaoDeTreino> listarTodas() {
        return repository.findAll();
    }

    public Optional<SessaoDeTreino> buscarPorId(Long id) {
        return repository.findById(id);
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
                    return repository.save(sessao);
                })
                .orElseThrow(() -> new RuntimeException("Sessão não encontrada"));
    }
}