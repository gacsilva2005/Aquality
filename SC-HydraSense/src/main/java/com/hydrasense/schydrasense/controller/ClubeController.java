package com.hydrasense.schydrasense.controller;

import com.hydrasense.schydrasense.model.Clube;
import com.hydrasense.schydrasense.service.ClubeService;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/Clubes")
public class ClubeController {

    private final ClubeService service;

    public ClubeController(ClubeService service) {
        this.service = service;
    }

    @GetMapping
    public List<Clube> listar() {
        return service.listarTodos();
    }
}
