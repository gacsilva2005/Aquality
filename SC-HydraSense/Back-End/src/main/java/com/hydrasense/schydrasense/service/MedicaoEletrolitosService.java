package com.hydrasense.schydrasense.service;

import com.hydrasense.schydrasense.model.MedicaoEletrolitos;
import com.hydrasense.schydrasense.repository.MedicaoEletrolitosRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class MedicaoEletrolitosService {

    private final MedicaoEletrolitosRepository repository;

    public MedicaoEletrolitosService(MedicaoEletrolitosRepository repository) {
        this.repository = repository;
    }

    public MedicaoEletrolitos salvar(MedicaoEletrolitos medicao) {
        return repository.save(medicao);
    }

    public List<MedicaoEletrolitos> listarTodas() {
        return repository.findAll();
    }

    public Optional<MedicaoEletrolitos> buscarPorId(Long id) {
        return repository.findById(id);
    }

    public void deletar(Long id) {
        repository.deleteById(id);
    }
}