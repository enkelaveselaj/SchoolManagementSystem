import studentService from '../studentService';
import api from '../api';

jest.mock('../api');

describe('StudentService', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  test('getDashboard success returns data', async () => {
    const fakeData = { attendancePercentage: 90, averageGrade: 8.5 };
    api.get.mockResolvedValueOnce({ data: fakeData });

    const result = await studentService.getDashboard(1);

    expect(result.success).toBe(true);
    expect(result.data).toEqual(fakeData);
  });

  test('getDashboard failure returns error', async () => {
    api.get.mockRejectedValueOnce({ response: { data: { message: 'Not found' } } });

    const result = await studentService.getDashboard(999);

    expect(result.success).toBe(false);
    expect(result.error).toBe('Not found');
  });

  test('getGrades success returns grades array', async () => {
    const grades = [{ subject: 'Math', grade: 9, date: '2026-01-15' }];
    api.get.mockResolvedValueOnce({ data: grades });

    const result = await studentService.getGrades(1);

    expect(result.success).toBe(true);
    expect(result.data).toEqual(grades);
  });

  test('getAttendance success returns attendance data', async () => {
    const attendance = { percentage: 92, present: 46, absent: 4 };
    api.get.mockResolvedValueOnce({ data: attendance });

    const result = await studentService.getAttendance(1);

    expect(result.success).toBe(true);
    expect(result.data).toEqual(attendance);
  });
});

