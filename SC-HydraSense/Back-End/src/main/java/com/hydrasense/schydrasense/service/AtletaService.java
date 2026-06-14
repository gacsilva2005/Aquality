package com.hydrasense.schydrasense.service;

import com.hydrasense.schydrasense.dto.AtletaRequestDTO;
import com.hydrasense.schydrasense.dto.ConviteAtletaDTO;
import com.hydrasense.schydrasense.model.Atleta;
import com.hydrasense.schydrasense.model.Clube;
import com.hydrasense.schydrasense.model.SessaoDeTreino;
import com.hydrasense.schydrasense.repository.AtletaRepository;
import com.hydrasense.schydrasense.repository.ClubeRepository;
import com.hydrasense.schydrasense.repository.SessaoDeTreinoRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;
import java.util.Optional;

@Service
public class AtletaService {

    @Autowired
    private EmailService emailService;

    private final AtletaRepository repository;
    private final ClubeRepository clubeRepository;
    private final SessaoDeTreinoRepository sessaoDeTreinoRepository;

    public AtletaService(AtletaRepository repository, ClubeRepository clubeRepository,SessaoDeTreinoRepository sessaoDeTreinoRepository) {
        this.repository = repository;
        this.clubeRepository = clubeRepository;
        this.sessaoDeTreinoRepository = sessaoDeTreinoRepository;
    }

    private String gerarCodigo() {

        int numero = (int)(Math.random() * 900000) + 100000;

        return String.valueOf(numero);
    }

    public Atleta cadastrar(AtletaRequestDTO request) {

        if (request.getCodigoEquipe() == null || request.getCodigoEquipe().trim().isEmpty()) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "Código de equipe é obrigatório."
            );
        }

        Clube clube = clubeRepository.findByCodigo(request.getCodigoEquipe())
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.BAD_REQUEST,
                        "Código de equipe inválido ou inexistente."
                ));

        Atleta atleta = new Atleta();

        atleta.setNome(request.getNome());
        atleta.setEmail(request.getEmail());
        atleta.setSenha(request.getSenha());
        atleta.setDataNascimento(request.getDataNascimento());
        atleta.setModalidadePrincipal(request.getModalidadePrincipal());
        atleta.setPesoAtual(request.getPesoAtual());
        atleta.setModalidade(request.getModalidade());
        atleta.setAltura(request.getAltura());
        atleta.setSexo(request.getSexo());

        atleta.setClube(clube);

        String codigo = gerarCodigo();

        atleta.setCodigoAcesso(codigo);

        Atleta atletaSalvo = repository.save(atleta);

        try {
            emailService.enviarCodigo(
                    atleta.getEmail(),
                    codigo
            );
        } catch (Exception e) {
            System.err.println("Erro ao enviar email: " + e.getMessage());
        }

        return atletaSalvo;
    }

    public Atleta login(String email, String senha) {

        Atleta atleta = repository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Usuário não encontrado"));

        if (!atleta.getSenha().equals(senha)) {
            throw new RuntimeException("Senha inválida");
        }

        return atleta;
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

    // Enviar email para atleta
    public void enviarConvite(ConviteAtletaDTO dto) {

        String mensagem = """
            Oi %s!
            
            Parabéns, atleta!
            Você foi convidado para participar da equipe Engenharia Mauá.

            O seu código da equipe para cadastro no nosso aplicativo é: %s
            """
                .formatted(dto.getNome(), dto.getCodigoEquipe());

        emailService.enviarEmail(
                dto.getEmail(),
                "Convite HydraSense",
                mensagem
        );
    }

    // Atualizar dados do atleta
    public Atleta atualizar(Long id, Atleta atletaAtualizado) {
        return repository.findById(id)
                .map(atleta -> {
                    atleta.setNome(atletaAtualizado.getNome());
                    atleta.setDataNascimento(atletaAtualizado.getDataNascimento());
                    atleta.setModalidadePrincipal(atletaAtualizado.getModalidadePrincipal());
                    atleta.setPesoAtual(atletaAtualizado.getPesoAtual());
                    atleta.setSexo(atletaAtualizado.getSexo());
                    atleta.setFotoPerfil(atletaAtualizado.getFotoPerfil());
                    return repository.save(atleta);
                })
                .orElseThrow(() -> new RuntimeException("Atleta não encontrado"));
    }

    public List<SessaoDeTreino> listarPorAtleta(Long atletaId) {
        return sessaoDeTreinoRepository.findByAtletaId(atletaId);
    }
}