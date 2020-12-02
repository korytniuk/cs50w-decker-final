from rest_framework import pagination
from rest_framework.response import Response

class CustomPagination(pagination.PageNumberPagination):
    def get_paginated_response(self, data):
        try:
          next_page = self.page.next_page_number()
        except:
          next_page = None

        try:
          prev_page = self.page.previous_page_number()
        except:
          prev_page = None

        return Response({
            'links': {
                'next': self.get_next_link(),
                'previous': self.get_previous_link(),
            },
            'page': self.page.number,
            'next_page': next_page,
            'prev_page': prev_page,
            'count': self.page.paginator.count,
            'results': data
        })