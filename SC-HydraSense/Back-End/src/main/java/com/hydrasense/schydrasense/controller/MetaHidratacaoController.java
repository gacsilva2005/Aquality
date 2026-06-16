package com.hydrasense.schydrasense.controller;

import com.hydrasense.schydrasense.dto.MetaHidratacaoDTO;
import com.hydrasense.schydrasense.model.Atleta;
import com.hydrasense.schydrasense.model.MetaHidratacao;
import com.hydrasense.schydrasense.model.Profissional;
import com.hydrasense.schydrasense.repository.AtletaRepository;
import com.hydrasense.schydrasense.repository.MetaHidratacaoRepository;
import com.hydrasense.schydrasense.repository.ProfissionalRepository;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import java.util.Optional;

@CrossOrigin
@RestController
@RequestMapping("/meta-hidratacao")
public class MetaHidratacaoController {

    private final MetaHidratacaoRepository metaRepository;
    private final AtletaRepository atletaRepository;
    private final ProfissionalRepository profissionalRepository;

    public MetaHidratacaoController(MetaHidratacaoRepository metaRepository,
                                   AtletaRepository atletaRepository,
                                   ProfissionalRepository profissionalRepository) {
        this.metaRepository = metaRepository;
        this.atletaRepository = atletaRepository;
        this.profissionalRepository = profissionalRepository;
    }

    @GetMapping("/atleta/{atletaId}")
    public ResponseEntity<MetaHidratacao> buscarPorAtleta(@PathVariable Long atletaId) {
        Optional<MetaHidratacao> optMeta = metaRepository.findByAtletaId(atletaId);
        
        if (optMeta.isPresent()) {
            return ResponseEntity.ok(optMeta.get());
        }

        // Se não existir, buscamos o atleta para criar uma meta padrão inicial
        Atleta atleta = atletaRepository.findById(atletaId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Atleta não encontrado"));

        MetaHidratacao metaPadrao = new MetaHidratacao();
        metaPadrao.setAtleta(atleta);
        metaPadrao.setMetaVolumeMl(3000);
        metaPadrao.setObservacoes("Meta padrão inicial");
        metaPadrao.setProfissional(atleta.getProfissional());

        MetaHidratacao salva = metaRepository.save(metaPadrao);
        return ResponseEntity.ok(salva);
    }

    @PostMapping
    public ResponseEntity<MetaHidratacao> salvarMeta(@RequestBody MetaHidratacaoDTO dto) {
        if (dto.atletaId() == null) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "ID do atleta é obrigatório");
        }

        Atleta atleta = atletaRepository.findById(dto.atletaId())
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Atleta não encontrado"));

        MetaHidratacao meta = metaRepository.findByAtletaId(dto.atletaId())
                .orElseGet(() -> {
                    MetaHidratacao m = new MetaHidratacao();
                    m.setAtleta(atleta);
                    return m;
                });

        if (dto.metaVolumeMl() != null) {
            meta.setMetaVolumeMl(dto.metaVolumeMl());
        }
        meta.setObservacoes(dto.observacoes());

        if (dto.profissionalId() != null) {
            Profissional prof = profissionalRepository.findById(dto.profissionalId())
                    .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Profissional não encontrado"));
            meta.setProfissional(prof);
        } else if (atleta.getProfissional() != null) {
            meta.setProfissional(atleta.getProfissional());
        }

        MetaHidratacao salva = metaRepository.save(meta);
        return ResponseEntity.ok(salva);
    }
}
