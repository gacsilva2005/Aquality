package com.hydrasense.schydrasense.service;

import com.hydrasense.schydrasense.model.LoginRequest;
import com.hydrasense.schydrasense.model.Profissional;
import com.hydrasense.schydrasense.model.Clube;
import com.hydrasense.schydrasense.repository.ProfissionalRepository;
import com.hydrasense.schydrasense.repository.ClubeRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class ProfissionalService {

    private final ProfissionalRepository repository;
    private final ClubeRepository clubeRepository;

    public ProfissionalService(ProfissionalRepository repository, ClubeRepository clubeRepository) {
        this.repository = repository;
        this.clubeRepository = clubeRepository;
    }

    public Profissional salvar(Profissional profissional) {
        if (profissional.getClube() != null && profissional.getClube().getNome() != null) {
            clubeRepository.findByNome(profissional.getClube().getNome())
                           .ifPresent(profissional::setClube);
        }
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

    public Profissional atualizar(Long id, Profissional dados) {
        return repository.findById(id).map(p -> {
            p.setNome(dados.getNome());
            p.setEmail(dados.getEmail());
            p.setRegistro(dados.getRegistro());
            p.setEspecialidade(dados.getEspecialidade());
            p.setSexo(dados.getSexo());
            if (dados.getClube() != null && dados.getClube().getNome() != null) {
                clubeRepository.findByNome(dados.getClube().getNome())
                               .ifPresent(p::setClube);
            } else {
                p.setClube(null);
            }
            if (dados.getSenha() != null && !dados.getSenha().trim().isEmpty()) {
                p.setSenha(dados.getSenha());
            }
            return repository.save(p);
        }).orElseThrow(() -> new RuntimeException("Profissional não encontrado"));
    }
}