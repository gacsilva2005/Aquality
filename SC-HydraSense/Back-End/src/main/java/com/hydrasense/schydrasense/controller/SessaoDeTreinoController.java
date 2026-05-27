package com.hydrasense.schydrasense.controller;

import com.hydrasense.schydrasense.dto.IniciarTreinoDTO;
import com.hydrasense.schydrasense.dto.PesagemPosTreinoDTO;
import com.hydrasense.schydrasense.model.SessaoDeTreino;
import com.hydrasense.schydrasense.service.SessaoDeTreinoService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@CrossOrigin
@RestController
@RequestMapping("/sessoes-de-treino")
public class SessaoDeTreinoController {

    private final SessaoDeTreinoService service;

    public SessaoDeTreinoController(SessaoDeTreinoService service) {
        this.service = service;
    }

    @PostMapping
    public SessaoDeTreino salvar(@RequestBody SessaoDeTreino sessao) {
        return service.salvar(sessao);
    }

    @GetMapping
    public List<SessaoDeTreino> listar() {
        return service.listarTodas();
    }

    @PostMapping("/iniciar")
    public ResponseEntity<SessaoDeTreino> iniciar(
            @RequestBody IniciarTreinoDTO dto
    ) {
        return ResponseEntity.ok(service.iniciarTreino(dto));
    }

    @GetMapping("/atleta/{atletaId}")
    public ResponseEntity<List<SessaoDeTreino>> listarPorAtleta(
            @PathVariable Long atletaId
    ) {
        return ResponseEntity.ok(service.listarPorAtleta(atletaId));
    }

    @PutMapping("/{sessaoId}/pesagem-pos")
    public ResponseEntity<SessaoDeTreino> registrarPesagemPos(
            @PathVariable Long sessaoId,
            @RequestBody PesagemPosTreinoDTO dto
    ) {
        return ResponseEntity.ok(service.registrarPesagemPos(sessaoId, dto));
    }

    @GetMapping("/{sessaoId}")
    public ResponseEntity<SessaoDeTreino> buscarPorId(@PathVariable Long sessaoId) {
        return ResponseEntity.ok(service.buscarPorId(sessaoId));
    }
}