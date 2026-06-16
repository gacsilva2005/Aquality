package com.hydrasense.schydrasense.controller;

import com.hydrasense.schydrasense.model.MedicaoEletrolitos;
import com.hydrasense.schydrasense.service.MedicaoEletrolitosService;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/eletrolitos")
public class MedicaoEletrolitosController {

    private final MedicaoEletrolitosService service;

    public MedicaoEletrolitosController(MedicaoEletrolitosService service) {
        this.service = service;
    }

    @PostMapping
    public MedicaoEletrolitos salvar(@RequestBody MedicaoEletrolitos medicao) {
        return service.salvar(medicao);
    }

    @GetMapping
    public List<MedicaoEletrolitos> listar() {
        return service.listarTodas();
    }

    @GetMapping("/{id}")
    public Optional<MedicaoEletrolitos> buscarPorId(@PathVariable Long id) {
        return service.buscarPorId(id);
    }

    @DeleteMapping("/{id}")
    public void deletar(@PathVariable Long id) {
        service.deletar(id);
    }
}