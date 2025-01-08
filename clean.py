from sqlalchemy import create_engine, text
engine = create_engine('sqlite:///touhou-music.db')

with engine.connect() as connection:
    result = connection.execute(text("SELECT genre FROM albums_index"))
    rows = result.fetchall()

# Initialize a set to store unique entries
unique_entries = set()

# Iterate over the rows and split the comma-separated values
count = 0
for row in rows:
    count += 1
    # Get the column value
    column_value = row[0]
    # Check if the value is not None
    if column_value is not None:
        # Split the comma-separated values
        entries = column_value.split('，')
        # Add each entry to the set (duplicates will be automatically handled by the set)
        for entry in entries:
            unique_entries.add(entry.strip())  # Strip whitespace for clean entries

# Convert the set to a sorted list if needed
distinct_entries = sorted(unique_entries)

# Print or use the distinct entries as needed
print(distinct_entries)