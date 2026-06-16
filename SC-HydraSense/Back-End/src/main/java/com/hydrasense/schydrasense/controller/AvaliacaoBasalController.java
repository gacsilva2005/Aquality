package com.hydrasense.schydrasense.controller;

import com.hydrasense.schydrasense.model.AvaliacaoBasal;
import com.hydrasense.schydrasense.service.AvaliacaoBasalService;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/avaliacao-basal")
public class AvaliacaoBasalController {

    private final AvaliacaoBasalService service;

    public AvaliacaoBasalController(AvaliacaoBasalService service) {
        this.service = service;
    }

    @PostMapping
    public AvaliacaoBasal salvar(@RequestBody AvaliacaoBasal avaliacao) {
        return service.salvar(avaliacao);
    }

    @GetMapping
    public List<AvaliacaoBasal> listar() {
        return service.listarTodas();
    }

    @GetMapping("/{id}")
    public Optional<AvaliacaoBasal> buscarPorId(@PathVariable Long id) {
        return service.buscarPorId(id);
    }

    @DeleteMapping("/{id}")
    public void deletar(@PathVariable Long id) {
        service.deletar(id);
    }
}