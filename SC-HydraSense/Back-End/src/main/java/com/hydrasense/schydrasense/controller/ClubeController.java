package com.hydrasense.schydrasense.controller;

import com.hydrasense.schydrasense.model.Clube;
import com.hydrasense.schydrasense.repository.ClubeRepository;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/clubes")
public class ClubeController {

    private final ClubeRepository repository;

    public ClubeController(ClubeRepository repository) {
        this.repository = repository;
    }

    @GetMapping
    public List<Clube> listar() {
        return repository.findAll();
    }
}