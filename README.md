# Swedish Historic Housing and Forest Coverage  


This repository provides datasets and accompanying resources for a study of historical housing construction techniques in Sweden and their relationship with historic forest coverage. 

The data can be explored via a custom web-tool: [The Forest/Timber map](https://erikarnell.se/forest-timber-map/web/)
<p align="center">
<img width="800" alt="Map interface" src="https://github.com/user-attachments/assets/2cd82702-08f7-49d8-96aa-6f5314ac1150" />
</p>

## Overview
#### Purpose
This project was done as a part of a cource in *Digital Humanities Research Methods* at Linneus University. It is a small prototype for exporling how public available data from property listing can be utilised for geospatial analysis of historic building practices.

#### House data
The first part of this project is dataset containing ~5000 records of buildings. The data is scraped from three major Swedish realtor websites during one day in 2023. 

#### Forest data 
The second part is data about forest cover in the 1840s. This data has been extracted from a digitalisation of ["Skogskartan"](https://sok.riksarkivet.se/?ValdSortering=DatumStigande&PageSize=20&EndastDigitaliserat=False&FacettFilter=arkis_ark_typ_facet%24Karta%2Fritning%3A&typAvLista=Standard&AvanceradSok=True&Ort=Karlstads+stift&page=1&postid=Arkis+27cfdb7e-88b3-41ec-82da-fe1fe4babddc&tab=post&s=Balder) in the Swedish National Archive. This map has been georeferenced and processed to be computable. 

#### Analysis
A preliminary analysis of the relationship between the two datasets were performed via visualisation and statistical analysis.


## Data collection

### House Data  
The house data was collected by scraping non-apartement property listnings from three major Swedish realtor websites. The data was then indexed/cleaned. If the building technique of the frame was specified this has been extracted and modeled into a taxonomy described in the data model. This taxonomy contains different building techniques with a focus on wooden materials.

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

### Forest Coverage Data 
The historic forest cover data was extracted from the digitalisation of a map in the the Swedish National Archives.  ["Skogskartan"](https://sok.riksarkivet.se/?ValdSortering=DatumStigande&PageSize=20&EndastDigitaliserat=False&FacettFilter=arkis_ark_typ_facet%24Karta%2Fritning%3A&typAvLista=Standard&AvanceradSok=True&Ort=Karlstads+stift&page=1&postid=Arkis+27cfdb7e-88b3-41ec-82da-fe1fe4babddc&tab=post&s=Balder). The map was created in 1840 and contains three categories of forest: `Shrubland`, `Forest for firewood and charcoal` and `Forest for sawmills and construction`. Only the last category was used for this project. The map was georeferenced and processed in `QGIS` to be computable. 

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

## Analysis
A quick preliminary analysis was performed where different groups of building techniqued were compared to forest cover. 

<br />

### Visualisation
In the heat map below is a visualisation of the spatial distrubution of three construnction technique groups on top of the 1840 forest cover. 

- Full log (green) 
- Wood saving texhniques (yellow) 
- Stone and brick (blue) 

<img width="700" alt="Chart 2" src="https://github.com/user-attachments/assets/96cbb199-3922-4999-a6a2-75f462f7098f" />
<br />

### Statistics
The forest cover within a radius of 100km, and the closest distance to a forest was examined via bar-graphs:

Chart 1 | Chart 2
------|------|
<img width="300" alt="Chart 2" src="https://github.com/user-attachments/assets/35ddd053-84f9-4578-bb70-f5860a72d54e" />|<img width="300" alt="Chart 1" src="https://github.com/user-attachments/assets/72860106-e340-4e20-84c2-9fea6f990a0b" />
Average forest cover within a 100km radius |  Average distance to nearest forest



