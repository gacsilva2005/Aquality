package com.hydrasense.schydrasense.service;

import com.hydrasense.schydrasense.model.LoginRequest;
import com.hydrasense.schydrasense.model.Profissional;
import com.hydrasense.schydrasense.repository.ProfissionalRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class ProfissionalService {

    private final ProfissionalRepository repository;

    public ProfissionalService(ProfissionalRepository repository) {
        this.repository = repository;
    }

    public Profissional salvar(Profissional profissional) {
        return repository.save(profissional);
    }

    public List<Profissional> listar() {
        return repository.findAll();
    }

    public Optional<Profissional> buscarPorId(Long id) {
        return repository.findById(id);
    }

    public void deletar(Long id) {
        repository.deleteById(id);
    }

    public Optional<Profissional> login(String email, String senha) {
        return repository.findByEmailAndSenha(email, senha);
    }

    public Optional<Profissional> autenticar(LoginRequest request) {
        Optional<Profissional> profissional =
                repository.findByEmail(request.getEmail());

        if (profissional.isPresent()) {
            if (profissional.get().getSenha().equals(request.getSenha())) {
                return profissional;
            }
        }

        return Optional.empty();
    }
}