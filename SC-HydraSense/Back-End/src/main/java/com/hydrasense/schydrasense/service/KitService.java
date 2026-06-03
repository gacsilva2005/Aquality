package com.hydrasense.schydrasense.service;

import com.hydrasense.schydrasense.model.Kit;
import com.hydrasense.schydrasense.repository.KitRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class KitService {

    private final KitRepository kitRepository;

    public KitService(KitRepository kitRepository) {
        this.kitRepository = kitRepository;
    }

    public List<Kit> listarPorAtleta(Long atletaId, String modalidade) {
        if (modalidade != null && !modalidade.isBlank()) {
            return kitRepository.findByAtletaIdAndModalidadeIgnoreCase(atletaId, modalidade);
        }
        return kitRepository.findByAtletaId(atletaId);
    }

    public Kit buscarPorId(Long kitId) {
        return kitRepository.findById(kitId)
                .orElseThrow(() -> new RuntimeException("Kit não encontrado: " + kitId));
    }
}