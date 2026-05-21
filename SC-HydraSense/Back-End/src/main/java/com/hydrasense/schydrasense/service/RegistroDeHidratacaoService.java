package com.hydrasense.schydrasense.service;

import com.hydrasense.schydrasense.model.RegistroDeHidratacao;
import com.hydrasense.schydrasense.repository.RegistroDeHidratacaoRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class RegistroDeHidratacaoService {

    private final RegistroDeHidratacaoRepository repository;

    // Injeção de dependência via construtor (padrão recomendado)
    public RegistroDeHidratacaoService(RegistroDeHidratacaoRepository repository) {
        this.repository = repository;
    }

    public RegistroDeHidratacao salvar(RegistroDeHidratacao registro) {
        return repository.save(registro);
    }

    public List<RegistroDeHidratacao> listarTodos() {
        return repository.findAll();
    }

    public Optional<RegistroDeHidratacao> buscarPorId(Long id) {
        return repository.findById(id);
    }

    public void deletar(Long id) {
        repository.deleteById(id);
    }
}