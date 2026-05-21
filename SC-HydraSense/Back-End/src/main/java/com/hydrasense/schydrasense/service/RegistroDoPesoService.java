package com.hydrasense.schydrasense.service;

import com.hydrasense.schydrasense.model.RegistroDoPeso;
import com.hydrasense.schydrasense.repository.RegistroDoPesoRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class RegistroDoPesoService {

    private final RegistroDoPesoRepository repository;

    public RegistroDoPesoService(RegistroDoPesoRepository repository) {
        this.repository = repository;
    }

    public RegistroDoPeso salvar(RegistroDoPeso registro) {
        return repository.save(registro);
    }

    public List<RegistroDoPeso> listarTodos() {
        return repository.findAll();
    }

    public Optional<RegistroDoPeso> buscarPorId(Long id) {
        return repository.findById(id);
    }

    public void deletar(Long id) {
        repository.deleteById(id);
    }
}