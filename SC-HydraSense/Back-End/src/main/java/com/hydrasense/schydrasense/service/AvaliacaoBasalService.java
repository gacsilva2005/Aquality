package com.hydrasense.schydrasense.service;

import com.hydrasense.schydrasense.model.AvaliacaoBasal;
import com.hydrasense.schydrasense.repository.AvaliacaoBasalRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class AvaliacaoBasalService {

    private final AvaliacaoBasalRepository repository;

    public AvaliacaoBasalService(AvaliacaoBasalRepository repository) {
        this.repository = repository;
    }

    public AvaliacaoBasal salvar(AvaliacaoBasal avaliacao) {
        return repository.save(avaliacao);
    }

    public List<AvaliacaoBasal> listarTodas() {
        return repository.findAll();
    }

    public Optional<AvaliacaoBasal> buscarPorId(Long id) {
        return repository.findById(id);
    }

    public void deletar(Long id) {
        repository.deleteById(id);
    }
}