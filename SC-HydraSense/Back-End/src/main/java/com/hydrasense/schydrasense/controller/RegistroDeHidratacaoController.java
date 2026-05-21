package com.hydrasense.schydrasense.controller;

import com.hydrasense.schydrasense.model.RegistroDeHidratacao;
import com.hydrasense.schydrasense.service.RegistroDeHidratacaoService;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/hidratacao")
public class RegistroDeHidratacaoController {

    private final RegistroDeHidratacaoService service;

    public RegistroDeHidratacaoController(RegistroDeHidratacaoService service) {
        this.service = service;
    }

    @PostMapping
    public RegistroDeHidratacao salvar(@RequestBody RegistroDeHidratacao registro) {
        return service.salvar(registro);
    }

    @GetMapping
    public List<RegistroDeHidratacao> listar() {
        return service.listarTodos();
    }

    @GetMapping("/{id}")
    public Optional<RegistroDeHidratacao> buscarPorId(@PathVariable Long id) {
        return service.buscarPorId(id);
    }

    @DeleteMapping("/{id}")
    public void deletar(@PathVariable Long id) {
        service.deletar(id);
    }
}