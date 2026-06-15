package com.hydrasense.schydrasense.controller;

import com.hydrasense.schydrasense.dto.EquipeRequestDTO;
import com.hydrasense.schydrasense.dto.EquipeResponseDTO;
import com.hydrasense.schydrasense.model.Equipe;
import com.hydrasense.schydrasense.service.EquipeService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/Equipe")
public class EquipeController {

    private final EquipeService equipeService;

    public EquipeController(EquipeService equipeService) {
        this.equipeService = equipeService;
    }

    @PostMapping
    public ResponseEntity<Equipe> criar(@RequestBody EquipeRequestDTO dto) {
        Equipe equipe = equipeService.criarEquipe(
                dto.getNome(),
                dto.getCategoria(),
                dto.getLimiteAtletas(),
                dto.getClubeId(),
                dto.getAtletasIds()
        );
        return ResponseEntity.ok(equipe);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Equipe> atualizar(@PathVariable Long id, @RequestBody EquipeRequestDTO dto) {
        Equipe equipe = equipeService.atualizarEquipe(
                id,
                dto.getNome(),
                dto.getCategoria(),
                dto.getLimiteAtletas(),
                dto.getAtletasIds()
        );
        return ResponseEntity.ok(equipe);
    }

    @GetMapping("/clube/{clubeId}")
    public ResponseEntity<List<EquipeResponseDTO>> listarPorClube(@PathVariable Long clubeId) {
        return ResponseEntity.ok(equipeService.listarResumosPorClube(clubeId));
    }

    @GetMapping("/{id}")
    public ResponseEntity<Equipe> buscar(@PathVariable Long id) {
        return equipeService.buscarPorId(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletar(@PathVariable Long id) {
        equipeService.deletar(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping
    public ResponseEntity<List<EquipeResponseDTO>> listarTodas() {
        return ResponseEntity.ok(equipeService.listarTodosResumos());
    }
}
