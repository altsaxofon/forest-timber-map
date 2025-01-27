# Swedish Historic Housing and Forest Coverage  


This repository provides datasets and accompanying resources for a study of historical housing construction techniques in Sweden and their relationship with historic forest coverage.

The data can be explored via a custom web tool: [The Forest/Timber map](https://erikarnell.se/forest-timber-map/web/)

<br />
<p align="center">
<img width="800" alt="Map interface" src="https://github.com/user-attachments/assets/c3a24ee7-f983-4f58-86f1-df73ad07b1de" />
</p>

<br />

## Overview
#### Purpose
This project was completed as part of a course in *Digital Humanities Research Methods* at Linnaeus University. It serves as a prototype for exploring how publicly available data from property listings can be utilised for geospatial analysis of historical building practices.

#### House data
The first part of this project is a dataset containing ~5000 records of listings. The data was scraped from three major Swedish realtor websites in a single day in 2023.

#### Forest data 
The second part consists of data about forest cover in the 1840s, extracted from a digitization of ["Skogskartan"](https://sok.riksarkivet.se/?ValdSortering=DatumStigande&PageSize=20&EndastDigitaliserat=False&FacettFilter=arkis_ark_typ_facet%24Karta%2Fritning%3A&typAvLista=Standard&AvanceradSok=True&Ort=Karlstads+stift&page=1&postid=Arkis+27cfdb7e-88b3-41ec-82da-fe1fe4babddc&tab=post&s=Balder) in the Swedish National Archives. This map has been georeferenced and processed to enable computational analysis.

#### Analysis
A preliminary analysis of the relationship between the two datasets was conducted through visualisation and statistical methods.
<br />

## Data collection

### House Data  
The house data was collected by scraping non-apartment property listings from three major Swedish realtor websites. The data was subsequently indexed and cleaned. If the construction technique of the building’s frame was specified, this information was extracted and modeled into a taxonomy described in the data model. This taxonomy categorizes various building techniques, with a focus on wooden materials.

<br />

**Data source example**

Realtor 1            |  Realtor 2      |  Realtor 3      |  Example house     
-------------------------|-------------------------|-------------------------|-------------------------
 ![R1](https://github.com/user-attachments/assets/75b0e328-93d3-4973-8b0c-de78ef1e0e98)| ![R2](https://github.com/user-attachments/assets/8f85e9ca-4d4a-45c5-9694-8b189a7c24be) |![R3](https://github.com/user-attachments/assets/e52e583f-35af-442e-8449-c1daf610d710) | ![406924513-f2f418c6-86e2-4274-b077-b83f7ef755c7](https://github.com/user-attachments/assets/8a64ce8c-dc28-4521-a428-f3732ea72724)


<br />

**Data model**

| **Name**                  | **Type**   | **Example value**         | **Description**                                             |
|---------------------------|------------|---------------------------|-------------------------------------------------------------|
| **Location**              |            |                           |                                                             |
| Latitude                  | Float      | 59.493942                 | Latitude in WGS 84                                          |
| Longitude                 | Float      | 17.947475                 | Longitude in WGS 84                                         |
| County                    | String     | Skåne                     | Region name                                                 |
| **Date**                  |            |                           |                                                             |
| Year of construction      | Date       | 1820-01-01                | Year of construction in date format.                       |
| **Frame**                 |            |                           |                                                             |
| Frame_wood                | Bool       | FALSE                     | If word "wood" is used in Frame                             |
| Frame_wood_beams          | Bool       | FALSE                     | If "wood beams" or similar is mentioned in Frame           |
| Frame_wood_logs           | Bool       | TRUE                      | If "logs" or similar is mentioned in Frame                 |
| Frame_wood_planks         | Bool       | FALSE                     | If "planks" or similar is mentioned in Frame               |
| Frame_wood_saving         | Bool       | TRUE                      | If wood saving techniques are mentioned in Frame           |
| Frame_concrete            | Bool       | FALSE                     | If "concrete" or similar is mentioned in Frame             |
| Frame_concrete_aerated    | Bool       | FALSE                     | If "aerated concrete" or similar is mentioned in Frame     |
| Frame_stone               | Bool       | TRUE                      | If "stone" or similar is mentioned in Frame                |
| Frame_bricks              | Bool       | FALSE                     | If "bricks" or similar is mentioned in Frame               |
| Frame_bricks_leca         | Bool       | FALSE                     | If "leca" or similar is mentioned in Frame                 |
| Frame_bricks_adobe        | Bool       | TRUE                      | If "adobe" or similar is mentioned in Frame                |
| Frame_steel               | Bool       | FALSE                     | If "steel" or similar is mentioned in Frame                |
| Frame                     | String     | Sannolik lersten med  <br />korsvirke samt gråsten. <br />Annat material kan  <br />förekomma. | Original frame description from property listing.          |

<br />

### Forest Cover Data 
The historic forest cover data was extracted from the digitization of a map in the Swedish National Archives, ["Skogskartan"](https://sok.riksarkivet.se/?ValdSortering=DatumStigande&PageSize=20&EndastDigitaliserat=False&FacettFilter=arkis_ark_typ_facet%24Karta%2Fritning%3A&typAvLista=Standard&AvanceradSok=True&Ort=Karlstads+stift&page=1&postid=Arkis+27cfdb7e-88b3-41ec-82da-fe1fe4babddc&tab=post&s=Balder). The map, created in the 1840s, contains three categories of forest: `Shrubland`, `Forest for firewood and charcoal` and `Forest for sawmills and construction`.  Only the last category was used in this project. The map was georeferenced and processed in QGIS to enable computational analysis.

<br />

**Forest map**

Original |  Geo-referenced      |  Final data
-------------------------|-------------------------|-------------------------
<img width="300" alt="Layer 3" src="https://github.com/user-attachments/assets/dc1719fb-2958-4b2d-a13d-8b22a9677f00" />|<img width="300" alt="Layer 2" src="https://github.com/user-attachments/assets/aa9f07ba-bcfc-4f3d-a22c-883e9bd571d1" />|<img width="300" alt="Layer 1" src="https://github.com/user-attachments/assets/a12bf7ac-b086-4c85-9a50-a98a32ce1160" />

<br />

**Map processing**

Step 1 |  Step 2 |Step 3 |Step 4 |Step 5 |Step 6
------|------|------|------|------|------
![1](https://github.com/user-attachments/assets/48530e44-946d-492e-9dc3-59cff664d09c)|![2](https://github.com/user-attachments/assets/d3914634-9942-48fa-9cd6-4a0d4bc8168f)|![3](https://github.com/user-attachments/assets/860739e1-c837-446e-93dc-7413977f3d3f)|![4](https://github.com/user-attachments/assets/5038a0c9-b28a-4b84-9526-e15c0e21c537)|![5](https://github.com/user-attachments/assets/3be1aeb0-b5b6-4ca0-b695-a650ea36e9af)|![6](https://github.com/user-attachments/assets/cb4d8873-de4f-467e-b081-0873eb616b2b)
Import |  Isolate regions | Extract | Blur |Threshold | Verify

<br />

## Analysis
A preliminary analysis was conducted to compare different groups of building techniques with forest cover data.
<br />

### Visualisation
The heat map below visualises the spatial distribution of three construction technique groups overlaid on the 1840 forest cover data:

- Full log (green) 
- Wood saving texhniques (yellow) 
- Stone and brick (blue) 

<img width="700" alt="Chart 2" src="https://github.com/user-attachments/assets/96cbb199-3922-4999-a6a2-75f462f7098f" />
<br />

### Statistics
The forest cover within a 100km radius and the closest distance to forested areas were analyzed and visualised via bar grpahs.

Chart 1 | Chart 2
------|------|
<img width="300" alt="Chart 2" src="https://github.com/user-attachments/assets/35ddd053-84f9-4578-bb70-f5860a72d54e" />|<img width="300" alt="Chart 1" src="https://github.com/user-attachments/assets/72860106-e340-4e20-84c2-9fea6f990a0b" />
Average forest cover within a 100km radius |  Average distance to nearest forest
<br />

## Web interface

The web interface was designed to facilitate exploration of the house and forest cover datasets. It allows users to:
- **Filter Houses:** Filter based on construction year and building techniques.
- **Visualise Forest Relations:** Display forest relationships of filtered houses through interactive graphs.
- **View individual data points:** Select individual houses to view their specific data and details.
- **Switch Base Maps:** Toggle between the original map and the processed forest cover data as the base map.
	
The tool was built using the open source Javascript mapping library [OpenLayers](https://openlayers.org/) and the base map is the `Positron` map by [CARTO](https://carto.com/basemaps)

<br />

| Overview     | Detail |
| ---      | ---       |
<img width="450" alt="Map interface" src="https://github.com/user-attachments/assets/c3a24ee7-f983-4f58-86f1-df73ad07b1de" />|<img width="450" alt="Map interface" src="https://github.com/user-attachments/assets/23177d5f-0ad7-42ca-9a0a-b991d8dd36d4" />





