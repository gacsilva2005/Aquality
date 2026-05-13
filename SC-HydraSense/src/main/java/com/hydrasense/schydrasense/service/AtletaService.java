package com.hydrasense.schydrasense.service;

import com.hydrasense.schydrasense.model.Atleta;
import com.hydrasense.schydrasense.repository.AtletaRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class AtletaService {

    @Autowired
    private EmailService emailService;

    private final AtletaRepository repository;

    public AtletaService(AtletaRepository repository) {
        this.repository = repository;
    }

    private String gerarCodigo() {

        int numero = (int)(Math.random() * 900000) + 100000;

        return String.valueOf(numero);
    }

    // Salvar atleta
    public Atleta salvar(Atleta atleta) {

        String codigo = gerarCodigo();

        atleta.setCodigoAcesso(codigo);

        Atleta atletaSalvo = repository.save(atleta);

        emailService.enviarCodigo(
                atleta.getEmail(),
                codigo
        );

        return atletaSalvo;
    }

    // Listar todos os atletas
    public List<Atleta> listarTodos() {
        return repository.findAll();
    }

    // Buscar atleta por ID
    public Optional<Atleta> buscarPorId(Long id) {
        return repository.findById(id);
    }

    // Deletar atleta
    public void deletar(Long id) {
        repository.deleteById(id);
    }

    // Atualizar dados do atleta
    public Atleta atualizar(Long id, Atleta atletaAtualizado) {
        return repository.findById(id)
                .map(atleta -> {
                    atleta.setNome(atletaAtualizado.getNome());
                    atleta.setDataNascimento(atletaAtualizado.getDataNascimento());
                    atleta.setModalidadePrincipal(atletaAtualizado.getModalidadePrincipal());
                    atleta.setPesoAtual(atletaAtualizado.getPesoAtual());
                    return repository.save(atleta);
                })
                .orElseThrow(() -> new RuntimeException("Atleta não encontrado"));
    }
}