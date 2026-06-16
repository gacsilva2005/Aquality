package com.hydrasense.schydrasense.controller;

import com.hydrasense.schydrasense.model.RegistroDeSintoma;
import com.hydrasense.schydrasense.service.RegistroDeSintomaService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/registros-sintomas")
public class RegistroDeSintomaController {

    private final RegistroDeSintomaService service;

    public RegistroDeSintomaController(RegistroDeSintomaService service) {
        this.service = service;
    }

    // Criar
    @PostMapping
    public RegistroDeSintoma salvar(@RequestBody RegistroDeSintoma registro) {
        return service.salvar(registro);
    }

    // Listar
    @GetMapping
    public List<RegistroDeSintoma> listar() {
        return service.listarTodos();
    }

    // Buscar por ID (ainda sem ID)
    @GetMapping("/{id}")
    public RegistroDeSintoma buscar(@PathVariable Long id) {
        return service.buscarPorId(id)
                .orElseThrow(() -> new RuntimeException("Registro não encontrado"));
    }

    // Atualizar (ainda sem ID)
    @PutMapping("/{id}")
    public RegistroDeSintoma atualizar(@PathVariable Long id,
                                       @RequestBody RegistroDeSintoma registro) {
        return service.atualizar(id, registro);
    }

    // Deletar (ainda sem ID)
    @DeleteMapping("/{id}")
    public void deletar(@PathVariable Long id) {
        service.deletar(id);
    }
}