package com.infosys.realestate.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import com.infosys.realestate.entity.Property;
import com.infosys.realestate.entity.User;
import com.infosys.realestate.repository.PropertyRepository;
import com.infosys.realestate.repository.UserRepository;

@Service
public class PropertyServiceImpl implements PropertyService {

    @Autowired
    private PropertyRepository propertyRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private AddressValidationService addressValidationService;

    @Override
    public Property saveProperty(Property property) {

        addressValidationService.validateAddress(property);

        Authentication authentication =
                SecurityContextHolder.getContext().getAuthentication();

        if (authentication == null || !authentication.isAuthenticated()) {
            throw new RuntimeException("User is not authenticated");
        }

        String email = authentication.getName();

        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        property.setCreatedBy(user);

        return propertyRepository.save(property);
    }

    @Override
    public List<Property> getAllProperties() {
        return propertyRepository.findAll();
    }

    @Override
    public Property getPropertyById(Long id) {
        return propertyRepository.findById(id).orElse(null);
    }

    @Override
    public Property updateProperty(Long id, Property property) {

        addressValidationService.validateAddress(property);

        property.setPropertyId(id);

        return propertyRepository.save(property);
    }

    @Override
    public void deleteProperty(Long id) {
        propertyRepository.deleteById(id);
    }

    @Override
    public List<Property> searchByCity(String city) {
        return propertyRepository.findByCity(city);
    }

    @Override
    public List<Property> searchByState(String state) {
        return propertyRepository.findByState(state);
    }

    @Override
    public List<Property> searchByZipCode(String zipCode) {
        return propertyRepository.findByZipCode(zipCode);
    }

    @Override
    public List<Property> searchByPropertyType(String propertyType) {
        return propertyRepository.findByPropertyType(propertyType);
    }
}