package com.hydrasense.schydrasense.controller;

import com.hydrasense.schydrasense.model.SessaoDeTreino;
import com.hydrasense.schydrasense.service.SessaoDeTreinoService;
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
}