DROP TABLE feature;

CREATE TABLE feature (
  featureid    SERIAL CONSTRAINT featurefeatureidkey PRIMARY KEY,
  userid       INTEGER,
  name         TEXT
);
SELECT AddGeometryColumn('cmb', 'feature', 'route', 4326, 'LINESTRING', 2);
SELECT AddGeometryColumn('cmb', 'feature', 'routestart', 4326, 'POINT', 2);
SELECT AddGeometryColumn('cmb', 'feature', 'routeend', 4326, 'POINT', 2);
GRANT SELECT ON feature to nobody;
GRANT ALL PRIVILEGES ON feature to webster;

DROP TABLE cmbuser;
CREATE TABLE cmbuser (
  userid       SERIAL CONSTRAINT useruseridkey PRIMARY KEY,
	password     TEXT,
	email        TEXT
);
INSERT INTO cmbuser (email) VALUES ('nobody@nowhere.com');
GRANT SELECT ON cmbuser to nobody;
GRANT ALL PRIVILEGES ON cmbuser to webster;

DROP TABLE story;
CREATE TABLE story (
  storyid      SERIAL CONSTRAINT storystoryidkey PRIMARY KEY,
	featureid    INTEGER,
	userid       INTEGER
);
GRANT SELECT ON story to nobody;
GRANT ALL PRIVILEGES ON story to webster;

DROP TABLE content;
CREATE TABLE content (
  storyid      INTEGER,
	htmlfile     TEXT,
	mediafile    TEXT,
	starthtmlfile     TEXT,
	startmediafile    TEXT,
	endhtmlfile     TEXT,
	endmediafile    TEXT
);
GRANT SELECT ON content to nobody;
GRANT ALL PRIVILEGES ON content to webster;


