package com.hydrasense.schydrasense.controller;

import com.hydrasense.schydrasense.model.Kit;
import com.hydrasense.schydrasense.model.Atleta;
import com.hydrasense.schydrasense.service.KitService;
import com.hydrasense.schydrasense.repository.AtletaRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@CrossOrigin
@RestController
@RequestMapping("/Kit")
public class KitController {

    private final KitService kitService;
    private final AtletaRepository atletaRepository;

    public KitController(KitService kitService, AtletaRepository atletaRepository) {
        this.kitService = kitService;
        this.atletaRepository = atletaRepository;
    }

    @GetMapping("/atleta/{atletaId}")
    public ResponseEntity<List<Kit>> listarPorAtleta(
            @PathVariable Long atletaId,
            @RequestParam(required = false) String modalidade
    ) {
        return ResponseEntity.ok(kitService.listarPorAtleta(atletaId, modalidade));
    }

    @PostMapping
    public ResponseEntity<Kit> criar(@RequestBody KitRequestDTO dto) {
        Atleta atleta = atletaRepository.findById(dto.atletaId())
                .orElseThrow(() -> new RuntimeException("Atleta não encontrado: " + dto.atletaId()));
        Kit kit = new Kit(dto.nome(), dto.modalidade(), dto.pesoTotal(), atleta);
        return ResponseEntity.ok(kitService.salvar(kit));
    }

    @PutMapping("/{id}")
    public ResponseEntity<Kit> atualizar(@PathVariable Long id, @RequestBody KitRequestDTO dto) {
        Kit kit = kitService.buscarPorId(id);
        kit.setNome(dto.nome());
        kit.setModalidade(dto.modalidade());
        kit.setPesoTotal(dto.pesoTotal());
        return ResponseEntity.ok(kitService.salvar(kit));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletar(@PathVariable Long id) {
        kitService.deletar(id);
        return ResponseEntity.noContent().build();
    }

    @PutMapping("/atleta/{atletaId}/principal/{kitId}")
    public ResponseEntity<Atleta> definirPrincipal(@PathVariable Long atletaId, @PathVariable Long kitId) {
        Atleta atleta = atletaRepository.findById(atletaId)
                .orElseThrow(() -> new RuntimeException("Atleta não encontrado: " + atletaId));
        if (kitId == 0) {
            atleta.setKitPrincipalId(null);
        } else {
            atleta.setKitPrincipalId(kitId);
        }
        return ResponseEntity.ok(atletaRepository.save(atleta));
    }
}

record KitRequestDTO(String nome, String modalidade, Float pesoTotal, Long atletaId) {}
