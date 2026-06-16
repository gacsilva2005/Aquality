package com.hydrasense.schydrasense.controller;

import com.hydrasense.schydrasense.model.RegistroDoPeso;
import com.hydrasense.schydrasense.service.RegistroDoPesoService;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/pesos")
public class RegistroDoPesoController {

    private final RegistroDoPesoService service;

    public RegistroDoPesoController(RegistroDoPesoService service) {
        this.service = service;
    }

    @PostMapping
    public RegistroDoPeso salvar(@RequestBody RegistroDoPeso registro) {
        return service.salvar(registro);
    }

    @GetMapping
    public List<RegistroDoPeso> listar() {
        return service.listarTodos();
    }

    @GetMapping("/{id}")
    public Optional<RegistroDoPeso> buscarPorId(@PathVariable Long id) {
        return service.buscarPorId(id);
    }

    @DeleteMapping("/{id}")
    public void deletar(@PathVariable Long id) {
        service.deletar(id);
    }
}