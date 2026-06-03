package com.hydrasense.schydrasense.controller;

import com.hydrasense.schydrasense.dto.*;
import com.hydrasense.schydrasense.model.Kit;
import com.hydrasense.schydrasense.model.SessaoDeTreino;
import com.hydrasense.schydrasense.service.SessaoDeTreinoService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import com.hydrasense.schydrasense.service.KitService;

import java.util.List;

@CrossOrigin
@RestController
@RequestMapping("/sessoes-de-treino")
public class SessaoDeTreinoController {

    private final SessaoDeTreinoService service;
    private final KitService kitService;

    public SessaoDeTreinoController(SessaoDeTreinoService service,  KitService kitService) {
        this.service = service;
        this.kitService = kitService;
    }

    @PostMapping
    public ResponseEntity<SessaoTreinoResponseDTO> salvar(@RequestBody SessaoDeTreino sessao) {
        return ResponseEntity.ok(service.salvar(sessao));
    }

    @GetMapping
    public ResponseEntity<List<SessaoTreinoResponseDTO>> listar() {
        return ResponseEntity.ok(service.listarTodas());
    }

    @PostMapping("/iniciar")
    public ResponseEntity<SessaoTreinoResponseDTO> iniciar(
            @RequestBody IniciarTreinoRequestDTO dto
    ) {
        return ResponseEntity.ok(service.iniciarTreino(dto));
    }

    @GetMapping("/atleta/{atletaId}")
    public ResponseEntity<List<SessaoTreinoResponseDTO>> listarPorAtleta(
            @PathVariable Long atletaId
    ) {
        return ResponseEntity.ok(service.listarPorAtleta(atletaId));
    }

    @PutMapping("/{sessaoId}/finalizar")
    public ResponseEntity<SessaoTreinoResponseDTO> finalizar(
            @PathVariable Long sessaoId,
            @RequestBody FinalizarSessaoRequestDTO dto
    ) {
        return ResponseEntity.ok(service.finalizarSessao(sessaoId, dto));
    }

    @GetMapping("/{sessaoId}")
    public ResponseEntity<SessaoTreinoResponseDTO> buscarPorId(@PathVariable Long sessaoId) {
        return ResponseEntity.ok(service.buscarPorId(sessaoId));
    }

    @GetMapping("/kits/atleta/{atletaId}")
    public ResponseEntity<List<Kit>> listarKitsDoAtleta(
            @PathVariable Long atletaId,
            @RequestParam(required = false) String modalidade
    ) {
        return ResponseEntity.ok(kitService.listarPorAtleta(atletaId, modalidade));
    }
}