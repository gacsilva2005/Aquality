package com.hydrasense.schydrasense.controller;

import com.hydrasense.schydrasense.dto.AtletaRequestDTO;
import com.hydrasense.schydrasense.dto.ConviteAtletaDTO;
import com.hydrasense.schydrasense.dto.LoginDTO;
import com.hydrasense.schydrasense.model.Atleta;
import com.hydrasense.schydrasense.model.SessaoDeTreino;
import com.hydrasense.schydrasense.repository.AtletaRepository;
import com.hydrasense.schydrasense.service.AtletaService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/Atleta")
public class AtletaController {

    @Autowired
    private AtletaRepository atletaRepository;

    private final AtletaService service;

    public AtletaController(AtletaService service) {
        this.service = service;
    }

    @PostMapping("/convite")
    public void enviarConvite(@RequestBody ConviteAtletaDTO dto) {
        service.enviarConvite(dto);
    }

    @PostMapping("/login")
    public Atleta login(@RequestBody LoginDTO dto) {return service.login(dto.email(), dto.senha());}

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

    @PostMapping
    public Atleta cadastrar(@RequestBody AtletaRequestDTO request) {
        return service.cadastrar(request);
    }

    @GetMapping("/atleta/{id}")
    public ResponseEntity<List<SessaoDeTreino>> listarPorAtleta(@PathVariable Long id) {
        return ResponseEntity.ok(service.listarPorAtleta(id));
    }

    @GetMapping("/clube/{clubeId}")
    public ResponseEntity<List<Atleta>> listarAtletasPorClube(@PathVariable Long clubeId) {
        List<Atleta> atletas = atletaRepository.findByClubeId(clubeId);
        return ResponseEntity.ok(atletas);
    }

}