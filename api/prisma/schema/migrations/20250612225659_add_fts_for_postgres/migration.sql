-- 1. `Company` tablosuna FTS vektör sütununu ekliyoruz
ALTER TABLE "Company" ADD COLUMN "search_vector" tsvector;

-- 2. Bu vektör sütununu otomatik olarak güncelleyecek bir fonksiyon oluşturuyoruz.
CREATE OR REPLACE FUNCTION update_company_search_vector()
RETURNS TRIGGER AS $$
BEGIN
  -- Arama yapılacak alanları ve ağırlıklarını burada belirliyoruz (A en yüksek öncelik)
  NEW.search_vector :=
    setweight(to_tsvector('turkish', coalesce(NEW.name, '')), 'A') ||
    setweight(to_tsvector('turkish', coalesce(NEW.industry, '')), 'B') ||
    setweight(to_tsvector('turkish', coalesce(NEW.description, '')), 'C');
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- 3. Her INSERT veya UPDATE işleminden ÖNCE bu fonksiyonu çalıştıracak bir trigger oluşturuyoruz.
CREATE TRIGGER company_search_vector_update
BEFORE INSERT OR UPDATE ON "Company"
FOR EACH ROW EXECUTE FUNCTION update_company_search_vector();

-- 4. `search_vector` sütununda hızlı arama yapmak için bir GIN indexi oluşturuyoruz.
CREATE INDEX company_search_vector_idx ON "Company" USING GIN(search_vector);