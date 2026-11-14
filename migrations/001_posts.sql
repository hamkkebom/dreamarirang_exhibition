-- 칼럼(블로그) 글
CREATE TABLE posts (
  id            BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  slug          TEXT NOT NULL UNIQUE
                CHECK (slug ~ '^[a-z0-9]+(-[a-z0-9]+)*$' AND length(slug) <= 120),
  title         TEXT NOT NULL CHECK (length(title) BETWEEN 1 AND 200),
  summary       TEXT NOT NULL DEFAULT '',
  content_mdx   TEXT NOT NULL DEFAULT '',
  category      TEXT NOT NULL DEFAULT '',
  tags          TEXT[] NOT NULL DEFAULT '{}',
  author_name   TEXT NOT NULL DEFAULT '함께봄 편집팀',
  faq_json      JSONB NOT NULL DEFAULT '[]'::jsonb CHECK (jsonb_typeof(faq_json) = 'array'),
  status        TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'published')),
  published_at  TIMESTAMPTZ,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at    TIMESTAMPTZ NOT NULL DEFAULT now(),
  CHECK (status = 'draft' OR published_at IS NOT NULL)
);

CREATE INDEX posts_published_idx ON posts (published_at DESC) WHERE status = 'published';

-- published_at은 처음 발행할 때 한 번만 정해지고, 그 뒤에는 바뀌지 않는다.
CREATE FUNCTION posts_guard() RETURNS trigger AS $$
BEGIN
  IF TG_OP = 'UPDATE' AND OLD.published_at IS NOT NULL THEN
    NEW.published_at := OLD.published_at;
  END IF;
  IF NEW.status = 'published' AND NEW.published_at IS NULL THEN
    NEW.published_at := now();
  END IF;
  IF TG_OP = 'UPDATE' THEN
    NEW.updated_at := now();
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER posts_guard_trg
  BEFORE INSERT OR UPDATE ON posts
  FOR EACH ROW EXECUTE FUNCTION posts_guard();

-- 관리자 로그인 시도 기록 (횟수 제한용)
CREATE TABLE login_attempts (
  id          BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  ip          TEXT NOT NULL,
  succeeded   BOOLEAN NOT NULL,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX login_attempts_ip_time_idx ON login_attempts (ip, created_at DESC);
