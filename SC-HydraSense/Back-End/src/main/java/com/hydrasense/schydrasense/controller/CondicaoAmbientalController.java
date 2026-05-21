package com.hydrasense.schydrasense.controller;

import com.hydrasense.schydrasense.model.CondicaoAmbiental;
import com.hydrasense.schydrasense.service.CondicaoAmbientalService;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/condicao-ambiental")
public class CondicaoAmbientalController {

    private final CondicaoAmbientalService service;

    public CondicaoAmbientalController(CondicaoAmbientalService service) {
        this.service = service;
    }

    @PostMapping
    public CondicaoAmbiental salvar(@RequestBody CondicaoAmbiental condicao) {
        return service.salvar(condicao);
    }

    @GetMapping
    public List<CondicaoAmbiental> listar() {
        return service.listarTodas();
    }

    @GetMapping("/{id}")
    public Optional<CondicaoAmbiental> buscarPorId(@PathVariable Long id) {
        return service.buscarPorId(id);
    }

    @DeleteMapping("/{id}")
    public void deletar(@PathVariable Long id) {
        service.deletar(id);
    }
}