package com.hydrasense.schydrasense.repository;

import com.hydrasense.schydrasense.model.Clube;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface ClubeRepository extends JpaRepository<Clube, Long> {
    Optional<Clube> findByCodigo(String codigo);
    Optional<Clube> findByNome(String nome);
}
