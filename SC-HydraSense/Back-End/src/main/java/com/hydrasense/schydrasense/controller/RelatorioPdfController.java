package com.hydrasense.schydrasense.controller;

import com.hydrasense.schydrasense.dto.RelatorioPdfDTO;
import com.hydrasense.schydrasense.service.RelatorioPdfService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.web.client.RestTemplate;

@RestController
@RequestMapping("/api/relatorios")
public class RelatorioPdfController {

    private final RelatorioPdfService relatorioPdfService;
    private final RestTemplate restTemplate;

    public RelatorioPdfController(RelatorioPdfService relatorioPdfService) {
        this.relatorioPdfService = relatorioPdfService;
        org.springframework.boot.web.client.RestTemplateBuilder builder = new org.springframework.boot.web.client.RestTemplateBuilder();
        this.restTemplate = builder
            .setConnectTimeout(java.time.Duration.ofSeconds(5))
            .setReadTimeout(java.time.Duration.ofSeconds(15))
            .build();
    }

    @GetMapping("/sessao/{sessaoId}/pdf")
    public ResponseEntity<byte[]> baixarRelatorioPdf(@PathVariable Long sessaoId) {
        // 1. Gera o JSON perfeito no Backend Java
        RelatorioPdfDTO payload = relatorioPdfService.gerarPayloadRelatorio(sessaoId);

        // 2. Dispara a requisição HTTP POST para o container Docker do pdf-engine
        String pdfEngineUrl = "http://hydrasense-pdf-engine:3000/generate";
        byte[] pdfBytes = restTemplate.postForObject(pdfEngineUrl, payload, byte[].class);

        // 3. Monta a resposta para forçar o download no navegador
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_PDF);
        headers.setContentDispositionFormData("attachment", "relatorio-hydroperform-" + sessaoId + ".pdf");
        headers.setCacheControl("must-revalidate, post-check=0, pre-check=0");

        return ResponseEntity.ok()
                .headers(headers)
                .body(pdfBytes);
    }
}
