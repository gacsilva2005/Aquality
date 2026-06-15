package com.hydrasense.schydrasense.service;

import com.hydrasense.schydrasense.model.Atleta;
import com.hydrasense.schydrasense.model.Clube;
import com.hydrasense.schydrasense.model.Equipe;
import com.hydrasense.schydrasense.repository.AtletaRepository;
import com.hydrasense.schydrasense.repository.ClubeRepository;
import com.hydrasense.schydrasense.repository.EquipeRepository;
import org.springframework.stereotype.Service;

import com.fasterxml.jackson.databind.ObjectMapper;

import java.util.HashSet;
import java.util.List;
import java.util.Optional;
import java.util.Set;
import java.util.stream.Collectors;

@Service
public class EquipeService {

    private final EquipeRepository equipeRepository;
    private final ClubeRepository clubeRepository;
    private final AtletaRepository atletaRepository;

    public EquipeService(EquipeRepository equipeRepository, ClubeRepository clubeRepository, AtletaRepository atletaRepository) {
        this.equipeRepository = equipeRepository;
        this.clubeRepository = clubeRepository;
        this.atletaRepository = atletaRepository;
    }

    public Equipe criarEquipe(String nome, String categoria, Integer limiteAtletas, Long clubeId, List<Long> atletasIds) {
        Equipe equipe = new Equipe();
        equipe.setNome(nome);
        equipe.setCategoria(categoria);
        equipe.setLimiteAtletas(limiteAtletas);

        Clube clube = clubeRepository.findById(clubeId)
                .orElseThrow(() -> new RuntimeException("Clube não encontrado"));
        equipe.setClube(clube);

        if (atletasIds != null && !atletasIds.isEmpty()) {
            List<Atleta> atletas = atletaRepository.findAllById(atletasIds);
            equipe.setAtletas(atletas);
        }

        Equipe equipeSalva = equipeRepository.save(equipe);

        if (atletasIds != null && !atletasIds.isEmpty()) {
            for (Long atletaId : atletasIds) {
                recalcularModalidadesAtleta(atletaId);
            }
        }

        return equipeSalva;
    }

    public Equipe atualizarEquipe(Long id, String nome, String categoria, Integer limiteAtletas, List<Long> atletasIds) {
        Equipe equipe = equipeRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Equipe não encontrada"));

        List<Long> oldAtletasIds = equipe.getAtletas().stream().map(Atleta::getId).collect(Collectors.toList());

        equipe.setNome(nome);
        equipe.setCategoria(categoria);
        equipe.setLimiteAtletas(limiteAtletas);

        if (atletasIds != null) {
            List<Atleta> atletas = atletaRepository.findAllById(atletasIds);
            equipe.setAtletas(atletas);
        } else {
            equipe.getAtletas().clear();
        }

        Equipe equipeSalva = equipeRepository.save(equipe);

        Set<Long> todosAtletasIds = new HashSet<>(oldAtletasIds);
        if (atletasIds != null) {
            todosAtletasIds.addAll(atletasIds);
        }

        for (Long atletaId : todosAtletasIds) {
            recalcularModalidadesAtleta(atletaId);
        }

        return equipeSalva;
    }

    public List<Equipe> listarTodas() {
        return equipeRepository.findAll();
    }

    public List<Equipe> listarPorClube(Long clubeId) {
        return equipeRepository.findByClubeId(clubeId);
    }

    public Optional<Equipe> buscarPorId(Long id) {
        return equipeRepository.findById(id);
    }

    public void deletar(Long id) {
        Equipe equipe = equipeRepository.findById(id).orElse(null);
        if (equipe != null) {
            List<Long> atletasIds = equipe.getAtletas().stream().map(Atleta::getId).collect(Collectors.toList());
            equipeRepository.deleteById(id);
            for (Long atletaId : atletasIds) {
                recalcularModalidadesAtleta(atletaId);
            }
        }
    }

    private void recalcularModalidadesAtleta(Long atletaId) {
        Atleta atleta = atletaRepository.findById(atletaId).orElse(null);
        if (atleta == null) return;

        List<Equipe> equipesDoAtleta = equipeRepository.findByAtletas_Id(atletaId);
        Set<String> modalidades = new HashSet<>();
        for (Equipe eq : equipesDoAtleta) {
            if (eq.getCategoria() != null && !eq.getCategoria().trim().isEmpty()) {
                modalidades.add(eq.getCategoria());
            }
        }

        try {
            ObjectMapper mapper = new ObjectMapper();
            atleta.setModalidade(mapper.writeValueAsString(modalidades));
            atletaRepository.save(atleta);
        } catch (Exception e) {
            e.printStackTrace();
        }
    }
}
