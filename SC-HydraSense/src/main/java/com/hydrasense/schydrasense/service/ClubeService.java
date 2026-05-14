package com.hydrasense.schydrasense.service;

import com.hydrasense.schydrasense.model.Clube;
import com.hydrasense.schydrasense.repository.ClubeRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class ClubeService {

    private final ClubeRepository repository;

    public ClubeService(ClubeRepository repository) {
        this.repository = repository;
    }

    public List<Clube> listarTodos() {
        return repository.findAll();
    }

    public Optional<Clube> buscarPorCodigo(String codigo) {
        return repository.findByCodigo(codigo);
    }
}
