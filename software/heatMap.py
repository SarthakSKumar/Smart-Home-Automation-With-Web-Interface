import json
import plotly.graph_objs as go
from plotly.offline import iplot

# Load GeoJSON data from file
with open('RENDER.geojson', 'r') as f:
    geojson_data = json.load(f)

# Create a list to hold the heatmap traces
heatmap_traces = []

# Loop through each feature in the GeoJSON data
for feature in geojson_data['features']:
    # Extract the coordinates and values from the feature
    coordinates = feature['geometry']['coordinates'][0]
    values = [float(feature['properties']['total_votes'].strip())]

    # Create a trace using the coordinates and values
    heatmap_trace = go.Scattermapbox(
        lat=[lat for lon, lat in coordinates],
        lon=[lon for lon, lat in coordinates],
        mode='markers',
        marker=go.scattermapbox.Marker(
            opacity=0.7,
            size=10,
            color=values,
            colorscale='Viridis'
        ),
        text=[str(value) for value in values],
        hoverinfo='text'
    )

    # Add the trace to the list of heatmap traces
    heatmap_traces.append(heatmap_trace)

# Create a layout for the heatmap
heatmap_layout = go.Layout(
    title='Heatmap of GeoJSON Data',
    mapbox=dict(
        accesstoken='pk.eyJ1Ijoic2FydGhha3NrdW1hciIsImEiOiJjbGdtajV3cnEwNmFhM2xwMzNia2Z4bTEwIn0.hgpYCMxoiy6lAexcO-oD2g',
        bearing=0,
        center=dict(
            lat=geojson_data['features'][0]['geometry']['coordinates'][0][0][1],
            lon=geojson_data['features'][0]['geometry']['coordinates'][0][0][0]
        ),
        pitch=0,
        zoom=10
    )
)

# Create a figure object
fig = go.Figure(data=heatmap_traces, layout=heatmap_layout)

# Display the figure in the notebook or in a web browser
iplot(fig)
