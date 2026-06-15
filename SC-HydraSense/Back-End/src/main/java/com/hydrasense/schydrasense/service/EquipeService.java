package com.hydrasense.schydrasense.service;

import com.hydrasense.schydrasense.dto.EquipeResponseDTO;
import com.hydrasense.schydrasense.model.Atleta;
import com.hydrasense.schydrasense.model.Clube;
import com.hydrasense.schydrasense.model.Equipe;
import com.hydrasense.schydrasense.model.SessaoDeTreino;
import com.hydrasense.schydrasense.repository.AtletaRepository;
import com.hydrasense.schydrasense.repository.ClubeRepository;
import com.hydrasense.schydrasense.repository.EquipeRepository;
import com.hydrasense.schydrasense.repository.RegistroDeHidratacaoRepository;
import com.hydrasense.schydrasense.repository.SessaoDeTreinoRepository;
import org.springframework.stereotype.Service;

import com.fasterxml.jackson.databind.ObjectMapper;

import java.time.LocalDate;
import java.time.LocalDateTime;
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
    private final RegistroDeHidratacaoRepository registroDeHidratacaoRepository;
    private final SessaoDeTreinoRepository sessaoDeTreinoRepository;

    public EquipeService(
            EquipeRepository equipeRepository,
            ClubeRepository clubeRepository,
            AtletaRepository atletaRepository,
            RegistroDeHidratacaoRepository registroDeHidratacaoRepository,
            SessaoDeTreinoRepository sessaoDeTreinoRepository
    ) {
        this.equipeRepository = equipeRepository;
        this.clubeRepository = clubeRepository;
        this.atletaRepository = atletaRepository;
        this.registroDeHidratacaoRepository = registroDeHidratacaoRepository;
        this.sessaoDeTreinoRepository = sessaoDeTreinoRepository;
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

    public List<EquipeResponseDTO> listarResumosPorClube(Long clubeId) {
        List<Equipe> equipes = equipeRepository.findByClubeId(clubeId);
        return equipes.stream()
                .map(this::obterResumoEquipe)
                .collect(Collectors.toList());
    }

    public List<EquipeResponseDTO> listarTodosResumos() {
        List<Equipe> equipes = equipeRepository.findAll();
        return equipes.stream()
                .map(this::obterResumoEquipe)
                .collect(Collectors.toList());
    }

    public EquipeResponseDTO obterResumoEquipe(Equipe equipe) {
        List<Atleta> atletas = equipe.getAtletas();
        int N = atletas.size();

        double totalTodayVolume = 0.0;
        double totalSweatRate = 0.0;
        int athletesWithSweatRate = 0;

        LocalDate today = LocalDate.now();
        LocalDateTime startOfDay = today.atStartOfDay();
        LocalDateTime endOfDay = today.plusDays(1).atStartOfDay();

        for (Atleta atleta : atletas) {
            Double athleteTodayVolume = registroDeHidratacaoRepository.sumVolumeByAtletaIdAndDateRange(atleta.getId(), startOfDay, endOfDay);
            if (athleteTodayVolume != null) {
                totalTodayVolume += athleteTodayVolume;
            }

            Optional<SessaoDeTreino> latestSessionOpt = sessaoDeTreinoRepository.findFirstByAtletaIdAndDataHoraFimIsNotNullAndTaxaSudoreseIsNotNullOrderByDataHoraFimDesc(atleta.getId());
            if (latestSessionOpt.isPresent()) {
                totalSweatRate += latestSessionOpt.get().getTaxaSudorese();
                athletesWithSweatRate++;
            }
        }

        double adherence = 0.0;
        if (N > 0) {
            adherence = totalTodayVolume / (3000.0 * N);
            adherence = Math.max(0.0, Math.min(1.0, adherence));
        }

        double avgSweatRate = 0.0;
        if (athletesWithSweatRate > 0) {
            avgSweatRate = totalSweatRate / athletesWithSweatRate;
        }

        return new EquipeResponseDTO(equipe, adherence, avgSweatRate);
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
