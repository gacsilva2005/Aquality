package com.hydrasense.schydrasense.controller;

import com.hydrasense.schydrasense.dto.IniciarTreinoDTO;
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
}