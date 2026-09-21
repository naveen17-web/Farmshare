package com.farmshare.service;

import com.farmshare.dto.EquipmentRequest;
import com.farmshare.entity.Equipment;
import com.farmshare.entity.User;
import com.farmshare.repository.EquipmentRepository;
import com.farmshare.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class EquipmentService {

    @Autowired
    private EquipmentRepository equipmentRepository;

    @Autowired
    private UserRepository userRepository;

    public List<Equipment> getAllEquipment() {
        return equipmentRepository.findAll();
    }

    public Optional<Equipment> getEquipmentById(Long id) {
        return equipmentRepository.findById(id);
    }

    public List<Equipment> getEquipmentByOwner(Long ownerId) {
        return equipmentRepository.findByOwnerId(ownerId);
    }

    public List<Equipment> searchEquipment(String query) {
        if (query == null || query.trim().isEmpty()) {
            return equipmentRepository.findAll();
        }
        return equipmentRepository.findByTitleContainingIgnoreCaseOrCategoryContainingIgnoreCaseOrBrandContainingIgnoreCase(
                query, query, query
        );
    }

    public Equipment createEquipment(EquipmentRequest req) {
        User owner = userRepository.findById(req.getOwnerId())
                .orElseThrow(() -> new RuntimeException("Owner not found with ID: " + req.getOwnerId()));

        Equipment eq = new Equipment();
        eq.setOwner(owner);
        eq.setTitle(req.getTitle());
        eq.setCategory(req.getCategory());
        eq.setBrand(req.getBrand());
        eq.setModelYear(req.getModelYear());
        eq.setHpPower(req.getHpPower());
        eq.setRegistrationNumber(req.getRegistrationNumber());
        eq.setHourlyRate(req.getHourlyRate());
        eq.setDailyRate(req.getDailyRate());
        eq.setSecurityDeposit(req.getSecurityDeposit());
        eq.setAddress(req.getAddress());
        eq.setVillage(req.getVillage());
        eq.setDistrict(req.getDistrict());
        eq.setState(req.getState());
        eq.setPincode(req.getPincode());
        eq.setSpecifications(req.getSpecifications());
        eq.setFeatures(req.getFeatures());
        eq.setImageUrl(req.getImageUrl());
        eq.setStatus("AVAILABLE");

        return equipmentRepository.save(eq);
    }

    public Equipment updateEquipment(Long id, EquipmentRequest req) {
        Equipment eq = equipmentRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Equipment not found: " + id));

        eq.setTitle(req.getTitle());
        eq.setCategory(req.getCategory());
        eq.setBrand(req.getBrand());
        eq.setModelYear(req.getModelYear());
        eq.setHpPower(req.getHpPower());
        eq.setHourlyRate(req.getHourlyRate());
        eq.setDailyRate(req.getDailyRate());
        eq.setSecurityDeposit(req.getSecurityDeposit());
        eq.setAddress(req.getAddress());
        eq.setSpecifications(req.getSpecifications());
        eq.setFeatures(req.getFeatures());
        if (req.getImageUrl() != null) eq.setImageUrl(req.getImageUrl());

        return equipmentRepository.save(eq);
    }

    public void deleteEquipment(Long id) {
        equipmentRepository.deleteById(id);
    }
}
