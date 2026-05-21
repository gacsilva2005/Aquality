package com.hydrasense.schydrasense.service;

import com.hydrasense.schydrasense.model.Atleta;
import com.hydrasense.schydrasense.model.LoginRequest;
import com.hydrasense.schydrasense.model.Profissional;
import com.hydrasense.schydrasense.repository.AtletaRepository;
import com.hydrasense.schydrasense.repository.ProfissionalRepository;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.Map;
import java.util.Optional;

@Service
public class AuthService {

    private final ProfissionalRepository profissionalRepository;
    private final AtletaRepository atletaRepository;

    public AuthService(
            ProfissionalRepository profissionalRepository,
            AtletaRepository atletaRepository
    ) {
        this.profissionalRepository = profissionalRepository;
        this.atletaRepository = atletaRepository;
    }

    public Map<String, Object> login(LoginRequest request) {

        Optional<Profissional> profissional =
                profissionalRepository.findByEmail(request.getEmail());

        if (profissional.isPresent() &&
                profissional.get().getSenha().equals(request.getSenha())) {

            Map<String, Object> resposta = new HashMap<>();
            resposta.put("tipo", "profissional");
            resposta.put("usuario", profissional.get());

            return resposta;
        }

        Optional<Atleta> atleta =
                atletaRepository.findByEmail(request.getEmail());

        if (atleta.isPresent() &&
                atleta.get().getSenha().equals(request.getSenha())) {

            Map<String, Object> resposta = new HashMap<>();
            resposta.put("tipo", "atleta");
            resposta.put("usuario", atleta.get());

            return resposta;
        }

        return null;
    }
}