package com.hydrasense.schydrasense.service;

import com.hydrasense.schydrasense.model.CondicaoAmbiental;
import com.hydrasense.schydrasense.repository.CondicaoAmbientalRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class CondicaoAmbientalService {

    private final CondicaoAmbientalRepository repository;

    public CondicaoAmbientalService(CondicaoAmbientalRepository repository) {
        this.repository = repository;
    }

    public CondicaoAmbiental salvar(CondicaoAmbiental condicao) {
        return repository.save(condicao);
    }

    public List<CondicaoAmbiental> listarTodas() {
        return repository.findAll();
    }

    public Optional<CondicaoAmbiental> buscarPorId(Long id) {
        return repository.findById(id);
    }

    public void deletar(Long id) {
        repository.deleteById(id);
    }
}