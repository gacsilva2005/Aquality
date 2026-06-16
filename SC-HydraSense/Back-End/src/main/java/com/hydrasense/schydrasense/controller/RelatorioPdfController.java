package com.hydrasense.schydrasense.controller;

import com.hydrasense.schydrasense.dto.RelatorioPdfDTO;
import com.hydrasense.schydrasense.dto.RelatorioEquipeDTO;
import com.hydrasense.schydrasense.service.RelatorioPdfService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.web.client.RestTemplate;
import org.springframework.boot.web.client.RestTemplateBuilder;
import java.time.Duration;

@RestController
@RequestMapping("/api/relatorios")
public class RelatorioPdfController {

    private final RelatorioPdfService relatorioPdfService;
    private final RestTemplate restTemplate;

    public RelatorioPdfController(RelatorioPdfService relatorioPdfService, RestTemplateBuilder builder) {
        this.relatorioPdfService = relatorioPdfService;
        this.restTemplate = builder
            .setConnectTimeout(Duration.ofSeconds(5))
            .setReadTimeout(Duration.ofSeconds(15))
            .build();
    }

    @GetMapping("/{tipo}/{id}/pdf")
    public ResponseEntity<byte[]> baixarRelatorioPdf(@PathVariable String tipo, @PathVariable Long id) {
        
        Object payload;
        
        // Switch-case para definir a estratégia de busca com base no tipo
        switch (tipo.toLowerCase()) {
            case "geral":
                payload = relatorioPdfService.gerarPayloadGeral(id); // id = clubeId
                break;
            case "equipe":
                payload = relatorioPdfService.gerarPayloadEquipe(id); // id = equipeId
                break;
            case "sessao":
                payload = relatorioPdfService.gerarPayloadSessao(id); // id = sessaoId
                break;
            default:
                return ResponseEntity.badRequest().build();
        }

        // Caso não haja dados no período, evita gerar um PDF vazio (retorna 204 No Content)
        if (payload == null) {
            return ResponseEntity.noContent().build(); 
        }

        // Dispara a requisição HTTP POST para o container Docker do pdf-engine, encapsulando tipo e payload
        String pdfEngineUrl = "http://hydrasense-pdf-engine:3000/generate";
        
        java.util.Map<String, Object> reqBody = java.util.Map.of(
            "tipo", tipo.toLowerCase(),
            "payload", payload
        );

        byte[] pdfBytes = restTemplate.postForObject(pdfEngineUrl, reqBody, byte[].class);

        // Monta a resposta para forçar o download no navegador
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_PDF);
        headers.setContentDispositionFormData("attachment", "relatorio-" + tipo + "-" + id + ".pdf");
        headers.setCacheControl("must-revalidate, post-check=0, pre-check=0");

        return ResponseEntity.ok()
                .headers(headers)
                .body(pdfBytes);
    }

    @GetMapping("/equipe/{id}/dados")
    public ResponseEntity<RelatorioEquipeDTO> obterDadosRelatorioEquipe(@PathVariable Long id) {
        RelatorioEquipeDTO payload = relatorioPdfService.gerarPayloadEquipe(id);
        if (payload == null || payload.atletas().isEmpty()) {
            return ResponseEntity.noContent().build();
        }
        return ResponseEntity.ok(payload);
    }
}
