package com.hydrasense.schydrasense.service;

import com.hydrasense.schydrasense.model.RegistroDeSintoma;
import com.hydrasense.schydrasense.repository.RegistroDeSintomaRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class RegistroDeSintomaService {

    private final RegistroDeSintomaRepository repository;

    public RegistroDeSintomaService(RegistroDeSintomaRepository repository) {
        this.repository = repository;
    }

    // Criar e salvar
    public RegistroDeSintoma salvar(RegistroDeSintoma registro) {
        return repository.save(registro);
    }

    // Listar todos
    public List<RegistroDeSintoma> listarTodos() {
        return repository.findAll();
    }

    // Buscar por ID
    public Optional<RegistroDeSintoma> buscarPorId(Long id) {
        return repository.findById(id);
    }

    // Deletar
    public void deletar(Long id) {
        repository.deleteById(id);
    }

    // Atualizar sintomas
    public RegistroDeSintoma atualizar(Long id, RegistroDeSintoma novoRegistro) {
        return repository.findById(id)
                .map(registro -> {
                    registro.setSintomas(novoRegistro.getSintomas());
                    registro.setDores(novoRegistro.getDores());
                    registro.setDataHora(novoRegistro.getDataHora());
                    return repository.save(registro);
                })
                .orElseThrow(() -> new RuntimeException("Registro não encontrado"));
    }
}