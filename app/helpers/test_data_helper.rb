module TestDataHelper
  def get_common_pagination_test_records(title, description)
    pagination_test_records = []
    (1..100).each do |i|
      pagination_test_record = {}
      pagination_test_record[title] = "Test " + i.to_s
      pagination_test_record[description] = "Test Description " + i.to_s

      pagination_test_records.push(pagination_test_record)
    end

    pagination_test_records
  end
end
