package com.hydrasense.schydrasense.service;

import com.hydrasense.schydrasense.model.Atleta;
import com.hydrasense.schydrasense.model.Clube;
import com.hydrasense.schydrasense.model.Equipe;
import com.hydrasense.schydrasense.repository.AtletaRepository;
import com.hydrasense.schydrasense.repository.ClubeRepository;
import com.hydrasense.schydrasense.repository.EquipeRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

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

        return equipeRepository.save(equipe);
    }

    public Equipe atualizarEquipe(Long id, String nome, String categoria, Integer limiteAtletas, List<Long> atletasIds) {
        Equipe equipe = equipeRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Equipe não encontrada"));

        equipe.setNome(nome);
        equipe.setCategoria(categoria);
        equipe.setLimiteAtletas(limiteAtletas);

        if (atletasIds != null) {
            List<Atleta> atletas = atletaRepository.findAllById(atletasIds);
            equipe.setAtletas(atletas);
        } else {
            equipe.getAtletas().clear();
        }

        return equipeRepository.save(equipe);
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
        equipeRepository.deleteById(id);
    }
}
