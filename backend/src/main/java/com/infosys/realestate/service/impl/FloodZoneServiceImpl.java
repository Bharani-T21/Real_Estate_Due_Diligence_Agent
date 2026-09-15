package com.infosys.realestate.service.impl;

import com.infosys.realestate.dto.FloodZoneResponse;
import com.infosys.realestate.entity.FloodZone;
import com.infosys.realestate.entity.Property;
import com.infosys.realestate.repository.FloodZoneRepository;
import com.infosys.realestate.repository.PropertyRepository;
import com.infosys.realestate.service.FloodZoneService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class FloodZoneServiceImpl implements FloodZoneService {

    @Autowired
    private FloodZoneRepository floodZoneRepository;

    @Autowired
    private PropertyRepository propertyRepository;

    @Override
    public FloodZoneResponse getFloodZoneByPropertyId(Long propertyId) {

        Property property = propertyRepository.findById(propertyId).orElse(null);

        FloodZone floodZone = floodZoneRepository
                .findByPropertyPropertyId(propertyId)
                .orElse(null);

        if (floodZone == null) {
            floodZone = new FloodZone();
            floodZone.setProperty(property);
        }

        if (propertyId != null && propertyId == 1L) {
            floodZone.setZone("Zone X (Minimal Risk)");
            floodZone.setBaseFloodElevation(14.5);
            floodZone.setInsuranceRequired(false);
            floodZone.setNearestWaterBody("Municipal Drainage Channel / Lake");
            floodZone.setDistanceToWaterBody(1.8);
            floodZone.setFemaPanel("FEMA-MAP-48201C1001");
        } else if (propertyId != null && propertyId == 2L) {
            floodZone.setZone("Zone X (Shaded - Low Risk)");
            floodZone.setBaseFloodElevation(12.0);
            floodZone.setInsuranceRequired(false);
            floodZone.setNearestWaterBody("Bellandur Stormwater Basin");
            floodZone.setDistanceToWaterBody(1.2);
            floodZone.setFemaPanel("FEMA-MAP-48201C1002");
        } else if (propertyId != null && propertyId == 3L) {
            floodZone.setZone("Zone AE (Moderate Flood Risk)");
            floodZone.setBaseFloodElevation(8.5);
            floodZone.setInsuranceRequired(true);
            floodZone.setNearestWaterBody("Noyyal River Tributary Channel");
            floodZone.setDistanceToWaterBody(0.4);
            floodZone.setFemaPanel("FEMA-MAP-48201C1003");
        } else if (propertyId != null && propertyId == 4L) {
            floodZone.setZone("Zone VE (High Risk River Basin)");
            floodZone.setBaseFloodElevation(4.2);
            floodZone.setInsuranceRequired(true);
            floodZone.setNearestWaterBody("Musi River Basin & Wetland Buffer");
            floodZone.setDistanceToWaterBody(0.08);
            floodZone.setFemaPanel("FEMA-MAP-48201C1004");
        }

        if (property != null) {
            floodZone = floodZoneRepository.save(floodZone);
        }

        FloodZoneResponse response = new FloodZoneResponse();

        if (floodZone.getProperty() != null) {
            response.setPropertyId(floodZone.getProperty().getPropertyId());
        } else {
            response.setPropertyId(propertyId);
        }

        response.setZone(floodZone.getZone());
        response.setBaseFloodElevation(floodZone.getBaseFloodElevation());
        response.setInsuranceRequired(floodZone.getInsuranceRequired());
        response.setNearestWaterBody(floodZone.getNearestWaterBody());
        response.setDistanceToWaterBody(floodZone.getDistanceToWaterBody());
        response.setFemaPanel(floodZone.getFemaPanel());

        return response;
    }
}
