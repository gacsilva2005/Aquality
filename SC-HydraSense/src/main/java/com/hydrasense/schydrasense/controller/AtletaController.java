package com.hydrasense.schydrasense.controller;

import com.hydrasense.schydrasense.dto.ConviteAtletaDTO;
import com.hydrasense.schydrasense.model.Atleta;
import com.hydrasense.schydrasense.service.AtletaService;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/Atleta")
public class AtletaController {

    private final AtletaService service;

    public AtletaController(AtletaService service) {
        this.service = service;
    }

    @PostMapping("/convite")
    public void enviarConvite(@RequestBody ConviteAtletaDTO dto) {
        service.enviarConvite(dto);
    }

    @GetMapping
    public List<Atleta> listar() {
        return service.listarTodos();
    }

    @GetMapping("/{id}")
    public Optional<Atleta> buscar(@PathVariable Long id) {
        return service.buscarPorId(id);
    }

    @PutMapping("/{id}")
    public Atleta atualizar(@PathVariable Long id, @RequestBody Atleta atleta) {
        return service.atualizar(id, atleta);
    }

    @DeleteMapping("/{id}")
    public void deletar(@PathVariable Long id) {
        service.deletar(id);
    }
}